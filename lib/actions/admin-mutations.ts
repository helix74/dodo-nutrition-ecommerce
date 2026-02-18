"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeClient } from "@/sanity/lib/client";
import { adminLogout } from "@/lib/auth/admin-session";

// ============ AUTH MUTATIONS ============

export async function adminLogoutAction(): Promise<void> {
  await adminLogout();
  redirect("/admin/login");
}

// ============ PRODUCT MUTATIONS ============

export async function updateProductField(
  id: string,
  field: string,
  value: unknown
): Promise<{ success: boolean; error?: string }> {
  try {
    await writeClient.patch(id).set({ [field]: value }).commit();
    revalidatePath("/admin/inventory");
    revalidatePath(`/admin/inventory/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to update ${field}:`, error);
    return { success: false, error: `Échec de la mise à jour de ${field}` };
  }
}

export async function publishDocument(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // In Sanity, publishing means the draft is merged into the published version
    // For documents without drafts, they're already published
    // The SDK's publish action patches the document and removes the draft prefix
    const draftId = id.startsWith("drafts.") ? id : `drafts.${id}`;
    const publishedId = id.replace(/^drafts\./, "");

    // Check if draft exists
    const draft = await writeClient.getDocument(draftId);

    if (draft) {
      // Create/update the published version with draft content
      await writeClient.createOrReplace({
        ...draft,
        _id: publishedId,
      });
      // Delete the draft
      await writeClient.delete(draftId);
    }

    revalidatePath("/admin/inventory");
    revalidatePath(`/admin/inventory/${publishedId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to publish:", error);
    return { success: false, error: "Échec de la publication" };
  }
}

export async function unpublishDocument(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const publishedId = id.replace(/^drafts\./, "");
    const draftId = `drafts.${publishedId}`;

    // Get the published document
    const published = await writeClient.getDocument(publishedId);

    if (published) {
      // Create a draft version
      await writeClient.createOrReplace({
        ...published,
        _id: draftId,
      });
      // Delete the published version
      await writeClient.delete(publishedId);
    }

    revalidatePath("/admin/inventory");
    revalidatePath(`/admin/inventory/${publishedId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to unpublish:", error);
    return { success: false, error: "Échec de l'annulation de publication" };
  }
}

export async function deleteDocument(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const publishedId = id.replace(/^drafts\./, "");
    const draftId = `drafts.${publishedId}`;

    // Delete both draft and published versions
    await writeClient.delete(publishedId).catch(() => {});
    await writeClient.delete(draftId).catch(() => {});

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete:", error);
    return { success: false, error: "Échec de la suppression" };
  }
}

// ============ ORDER MUTATIONS ============

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await writeClient.patch(id).set({ status }).commit();
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Échec de la mise à jour du statut" };
  }
}

export async function updateOrderAddress(
  id: string,
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await writeClient.patch(id).set({ shippingAddress: address }).commit();
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update order address:", error);
    return { success: false, error: "Échec de la mise à jour de l'adresse" };
  }
}

// ============ IMAGE MUTATIONS ============

export async function updateProductImages(
  id: string,
  images: Array<{
    _key: string;
    _type: string;
    asset: { _ref: string };
  }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await writeClient.patch(id).set({ images }).commit();
    revalidatePath("/admin/inventory");
    revalidatePath(`/admin/inventory/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update images:", error);
    return { success: false, error: "Échec de la mise à jour des images" };
  }
}
