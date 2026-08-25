"use server";

import { revalidatePath } from "next/cache";
import { reviewSubmission } from "@/lib/dashboard-data";
import { requireRole } from "@/lib/require-role";

export async function reviewSubmissionAction(formData: FormData) {
  await requireRole(["contributor", "admin"]);

  const submissionId = String(formData.get("submissionId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  if (!submissionId || (decision !== "Approved" && decision !== "Rejected")) return;

  await reviewSubmission(submissionId, decision);

  revalidatePath("/dashboard/contributor/reviews");
  revalidatePath("/dashboard/contributor");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/approvals");
}
