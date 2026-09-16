import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { storage, isFirebaseConfigured } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // 1. Try Firebase Storage if configured
    if (isFirebaseConfigured && storage) {
      try {
        const storageRef = ref(storage, `${folder}/${cleanFileName}`);
        const snapshot = await uploadBytes(storageRef, new Uint8Array(bytes), {
          contentType: file.type || 'image/jpeg',
        });
        const downloadUrl = await getDownloadURL(snapshot.ref);
        return NextResponse.json({
          success: true,
          url: downloadUrl,
          provider: 'firebase',
        });
      } catch (storageErr) {
        console.warn('Firebase Storage upload failed, falling back to local storage:', storageErr);
      }
    }

    // 2. Persistent fallback: base64 Data URL (guarantees image never 404s or disappears)
    const mimeType = file.type || 'image/jpeg';
    const base64Data = buffer.toString('base64');
    const persistentDataUrl = `data:${mimeType};base64,${base64Data}`;

    // Best-effort write to local disk as well
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, cleanFileName);
      fs.writeFileSync(filePath, buffer);
    } catch {
      // Ignore local disk write errors
    }

    return NextResponse.json({
      success: true,
      url: persistentDataUrl,
      provider: 'data-url',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
