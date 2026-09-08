import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const member = formData.get("member") as string;
    const file = formData.get("file") as File;

    if (!member || !file) {
      return NextResponse.json({ error: "Missing member or file" }, { status: 400 });
    }

    const validMembers = ["mathew", "sidhu", "mathew-ai"];
    if (!validMembers.includes(member)) {
      return NextResponse.json({ error: "Invalid member identifier" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const teamDir = path.join(process.cwd(), "public", "team");
    await fs.mkdir(teamDir, { recursive: true });

    const filePath = path.join(teamDir, `${member}.jpg`);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      path: `/team/${member}.jpg?t=${Date.now()}` 
    });
  } catch (error) {
    console.error("Team photo upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
