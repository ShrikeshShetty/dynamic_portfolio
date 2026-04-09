import { put, del } from '@vercel/blob';

export async function uploadToBlob(file: File, folder: string = 'portfolio'): Promise<string> {
  const filename = `${folder}/${Date.now()}-${file.name}`;
  const blob = await put(filename, file, {
    access: 'public',
  });
  return blob.url;
}

export async function deleteFromBlob(url: string): Promise<void> {
  await del(url);
}

export async function uploadPdfToBlob(file: File): Promise<{ url: string; filename: string }> {
  const filename = `resume/${Date.now()}-${file.name}`;
  const blob = await put(filename, file, {
    access: 'public',
  });
  return { url: blob.url, filename: file.name };
}
