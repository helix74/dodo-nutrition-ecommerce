import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";
import { isAdminAuthenticated } from "@/lib/auth/admin-session";

export async function POST() {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const newId = crypto.randomUUID();
    
    await writeClient.create({
      _type: "product",
      _id: `drafts.${newId}`,
      name: "",
      slug: { _type: "slug", current: "" },
      price: 0,
      stock: 0,
    });

    return NextResponse.json({ id: newId });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
