import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST() {
  try {
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
