import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const imageRefs: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const asset = await writeClient.assets.upload("image", buffer, {
        filename: file.name,
        contentType: file.type,
      });
      imageRefs.push(asset._id);
    }

    return NextResponse.json({ images: imageRefs });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
