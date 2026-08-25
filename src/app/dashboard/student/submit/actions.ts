"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { submitObservation } from "@/lib/dashboard-data";
import { requireRole } from "@/lib/require-role";
import { getSessionUserId } from "@/lib/auth";

export async function submitObservationAction(formData: FormData) {
  await requireRole("student");
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const photo = formData.get("photo");

  await submitObservation({
    studentId: userId,
    speciesSlug: (formData.get("species") as string) || null,
    zoneId: (formData.get("zone") as string) || null,
    notes: (formData.get("notes") as string) ?? "",
    photo: photo instanceof File && photo.size > 0 ? photo : null,
    asDraft: formData.get("intent") === "draft",
  });

  revalidatePath("/dashboard/student");
  revalidatePath("/dashboard/student/submissions");
  redirect("/dashboard/student/submissions");
}
