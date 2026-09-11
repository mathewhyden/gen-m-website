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

    // 2. Fallback to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, cleanFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${cleanFileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      provider: 'local',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
