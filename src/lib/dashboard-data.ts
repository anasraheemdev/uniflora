/**
 * Dashboard workflow data — Supabase-backed (Phase 2, Phase F).
 *
 * Replaces the static mocks in `src/data/dashboard.ts`. Every function here
 * runs under the signed-in user's own session (via `@/lib/supabase/server`),
 * so results are already scoped by the RLS policies in
 * `supabase/migrations/0006_workflow.sql` — a student's query for their own
 * submissions and a contributor's query for everyone's both "just work"
 * without extra filtering in application code.
 */
import { createClient } from "@/lib/supabase/server";
import { getMonthlyVisitorCount } from "@/lib/redis";
import type { Database } from "@/types/supabase";

type SubmissionStatus = Database["public"]["Enums"]["submission_status"];

export type StatTile = { label: string; value: string; change: string; icon: string };
export type QueueRow = { id: string; species: string; submitter: string; type: string; date: string; status: SubmissionStatus };
export type ActivityRow = { action: string; detail: string; user: string; time: string };
export type LearningRow = { title: string; progress: number; label: string };
export type ProfileRow = { name: string; email: string; role: string; status: string };

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${Math.max(minutes, 0)}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/** `QueueRow.id` is the real UUID (needed to act on the row) — this is just for display. */
export function displayId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

// ── Admin ────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<StatTile[]> {
  const supabase = await createClient();
  const [{ count: species }, { count: users }, { count: pending }, visitors] = await Promise.all([
    supabase.from("species").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("submissions").select("*", { count: "exact", head: true }).in("status", ["Pending", "Review"]),
    getMonthlyVisitorCount(),
  ]);

  return [
    { label: "Total Species", value: String(species ?? 0), change: "Live count", icon: "species" },
    { label: "Registered Users", value: String(users ?? 0), change: "Live count", icon: "users" },
    { label: "Pending Approvals", value: String(pending ?? 0), change: "Needs review", icon: "pending" },
    {
      label: "Monthly Visitors",
      value: visitors === null ? "—" : visitors.toLocaleString(),
      change: visitors === null ? "Enable Redis for live tracking" : "Last 30 days",
      icon: "visitors",
    },
  ];
}

export async function getPendingApprovals(limit = 10): Promise<QueueRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("id, type, status, created_at, species:species_id(scientific_name), student:student_id(full_name)")
    .in("status", ["Pending", "Review"])
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<
      {
        id: string;
        type: string;
        status: SubmissionStatus;
        created_at: string;
        species: { scientific_name: string } | null;
        student: { full_name: string | null } | null;
      }[]
    >();
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    species: row.species?.scientific_name ?? "Unidentified species",
    submitter: row.student?.full_name ?? "Unknown",
    type: row.type,
    date: shortDate(row.created_at),
    status: row.status,
  }));
}

export async function getActivityLog(limit = 10): Promise<ActivityRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity_log")
    .select("action, detail, created_at, actor:actor_id(full_name)")
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<{ action: string; detail: string | null; created_at: string; actor: { full_name: string | null } | null }[]>();
  if (error) throw error;
  return data.map((row) => ({
    action: row.action,
    detail: row.detail ?? "",
    user: row.actor?.full_name ?? "System",
    time: timeAgo(row.created_at),
  }));
}

export async function getAllUsers(): Promise<ProfileRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("full_name, email, role").order("full_name");
  if (error) throw error;
  return data.map((u) => ({ name: u.full_name ?? "—", email: u.email ?? "—", role: u.role, status: "Active" }));
}

// ── Contributor ──────────────────────────────────────────────────────────

export async function getContributorStats(userId: string): Promise<StatTile[]> {
  const supabase = await createClient();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [{ count: pendingReviews }, { count: verifiedThisMonth }, { count: specimensCurated }] = await Promise.all([
    supabase.from("submissions").select("*", { count: "exact", head: true }).in("status", ["Pending", "Review"]),
    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("reviewed_by", userId)
      .eq("status", "Approved")
      .gte("reviewed_at", monthStart.toISOString()),
    supabase.from("specimens").select("*", { count: "exact", head: true }).eq("digitized_by", userId),
  ]);

  return [
    { label: "Pending Reviews", value: String(pendingReviews ?? 0), change: "Awaiting decision", icon: "pending" },
    { label: "Verified This Month", value: String(verifiedThisMonth ?? 0), change: "By you", icon: "verified" },
    { label: "Specimens Curated", value: String(specimensCurated ?? 0), change: "By you", icon: "specimen" },
    { label: "Identification Keys", value: "4", change: "Trees, Shrubs, Herbs, Palms", icon: "keys" },
  ];
}

export async function getReviewQueue(limit = 20): Promise<QueueRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("id, type, status, created_at, species:species_id(scientific_name), student:student_id(full_name)")
    .in("status", ["Pending", "Review"])
    .order("created_at", { ascending: true })
    .limit(limit)
    .returns<
      {
        id: string;
        type: string;
        status: SubmissionStatus;
        created_at: string;
        species: { scientific_name: string } | null;
        student: { full_name: string | null } | null;
      }[]
    >();
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    species: row.species?.scientific_name ?? "Unidentified species",
    submitter: row.student?.full_name ?? "Unknown",
    type: row.type,
    date: shortDate(row.created_at),
    status: row.status,
  }));
}

export async function getContributorRecent(userId: string, limit = 10): Promise<ActivityRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity_log")
    .select("action, detail, created_at")
    .eq("actor_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map((row) => ({ action: row.action, detail: row.detail ?? "", user: "", time: timeAgo(row.created_at) }));
}

/** Approve or request changes on a submission — the contributor Reviews page's action buttons. */
export async function reviewSubmission(submissionId: string, decision: "Approved" | "Rejected") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { error } = await supabase
    .from("submissions")
    .update({ status: decision, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq("id", submissionId);
  if (error) throw error;
}

// ── Student ──────────────────────────────────────────────────────────────

export async function getStudentStats(userId: string): Promise<StatTile[]> {
  const supabase = await createClient();
  const [{ count: mySubmissions }, { count: approved }, { count: photosUploaded }, { data: quizProgress }] = await Promise.all([
    supabase.from("submissions").select("*", { count: "exact", head: true }).eq("student_id", userId),
    supabase.from("submissions").select("*", { count: "exact", head: true }).eq("student_id", userId).eq("status", "Approved"),
    supabase.from("submissions").select("*", { count: "exact", head: true }).eq("student_id", userId).not("photo_url", "is", null),
    supabase
      .from("learning_progress")
      .select("progress_pct, learning_modules!inner(title)")
      .eq("user_id", userId)
      .eq("learning_modules.title", "Families Quiz")
      .maybeSingle(),
  ]);

  return [
    { label: "My Submissions", value: String(mySubmissions ?? 0), change: "All time", icon: "submissions" },
    { label: "Approved", value: String(approved ?? 0), change: "Published to the map", icon: "approved" },
    { label: "Photos Uploaded", value: String(photosUploaded ?? 0), change: "Attached to submissions", icon: "photos" },
    { label: "Quiz Score", value: `${(quizProgress as { progress_pct: number } | null)?.progress_pct ?? 0}%`, change: "Families module", icon: "quiz" },
  ];
}

export async function getStudentSubmissions(userId: string, limit = 20): Promise<QueueRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("id, type, status, created_at, species:species_id(scientific_name)")
    .eq("student_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<{ id: string; type: string; status: SubmissionStatus; created_at: string; species: { scientific_name: string } | null }[]>();
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    species: row.species?.scientific_name ?? "Unidentified species",
    submitter: "",
    type: row.type,
    date: shortDate(row.created_at),
    status: row.status,
  }));
}

export async function getLearningProgress(userId: string): Promise<LearningRow[]> {
  const supabase = await createClient();
  const { data: modules, error } = await supabase.from("learning_modules").select("id, title").order("title");
  if (error) throw error;

  const { data: progress } = await supabase.from("learning_progress").select("module_id, progress_pct, label").eq("user_id", userId);
  const byModule = new Map((progress ?? []).map((p) => [p.module_id, p]));

  return modules.map((m) => {
    const p = byModule.get(m.id);
    return { title: m.title, progress: p?.progress_pct ?? 0, label: p?.label ?? "Not started" };
  });
}

/** The student "Submit Observation" form's real insert, with an optional photo upload. */
export async function submitObservation(input: {
  studentId: string;
  speciesSlug: string | null;
  zoneId: string | null;
  notes: string;
  photo: File | null;
  asDraft: boolean;
}) {
  const supabase = await createClient();

  let photoUrl: string | null = null;
  if (input.photo && input.photo.size > 0) {
    const path = `${input.studentId}/${Date.now()}-${input.photo.name}`;
    const { error: uploadError } = await supabase.storage.from("plant-photos").upload(path, input.photo);
    if (uploadError) throw uploadError;
    const { data: publicUrl } = supabase.storage.from("plant-photos").getPublicUrl(path);
    photoUrl = publicUrl.publicUrl;
  }

  let speciesId: string | null = null;
  if (input.speciesSlug) {
    const { data: species } = await supabase.from("species").select("id").eq("slug", input.speciesSlug).maybeSingle();
    speciesId = species?.id ?? null;
  }

  const { error } = await supabase.from("submissions").insert({
    student_id: input.studentId,
    species_id: speciesId,
    zone_id: input.zoneId,
    notes: input.notes || null,
    photo_url: photoUrl,
    type: photoUrl ? "Photo" : "Observation",
    status: input.asDraft ? "Draft" : "Pending",
  });
  if (error) throw error;
}
