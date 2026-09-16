import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { storage, isFirebaseConfigured } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const member = formData.get("member") as string;
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const memberId = member || "team-member";
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Try Firebase Storage if configured
    if (isFirebaseConfigured && storage) {
      try {
        const cleanName = `${Date.now()}-${memberId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const storageRef = ref(storage, `team/${cleanName}`);
        const snapshot = await uploadBytes(storageRef, new Uint8Array(bytes), {
          contentType: file.type || "image/jpeg",
        });
        const downloadUrl = await getDownloadURL(snapshot.ref);
        return NextResponse.json({
          success: true,
          path: downloadUrl,
          url: downloadUrl,
          provider: "firebase",
        });
      } catch (storageErr) {
        console.warn("Firebase Storage upload failed in team upload:", storageErr);
      }
    }

    // 2. Persistent fallback: base64 Data URL
    const mimeType = file.type || "image/jpeg";
    const persistentDataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // Also write to public/team if member identifier is standard
    try {
      const validMembers = ["mathew", "sidhu", "mathew-ai"];
      if (validMembers.includes(memberId)) {
        const teamDir = path.join(process.cwd(), "public", "team");
        await fs.mkdir(teamDir, { recursive: true });
        const filePath = path.join(teamDir, `${memberId}.jpg`);
        await fs.writeFile(filePath, buffer);
      }
    } catch {
      // Ignore local disk errors
    }

    return NextResponse.json({ 
      success: true, 
      path: persistentDataUrl,
      url: persistentDataUrl,
      provider: "data-url"
    });
  } catch (error: any) {
    console.error("Team photo upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload image" }, { status: 500 });
  }
}
