/**
 * UploadThing helper for direct browser uploads.
 * Uses the UploadThing REST API to get presigned URLs and upload files.
 */

const UPLOADTHING_TOKEN = import.meta.env.VITE_UPLOADTHING_TOKEN || 'eyJhcGlLZXkiOiJza19saXZlXzNlOTA1MjQwNTUzNjEwZWQzYWY0NDc3NzhhNTllYTQ5ZTAzM2MxYjQ3ODczMmMyOTQxYzhmY2NiZjlhNWIxOTciLCJhcHBJZCI6IjFva3Q1cHpqZ2wiLCJyZWdpb25zIjpbInNlYTEiXX0=';

interface UploadThingFile {
  id: string;
  name: string;
  size: number;
  url: string;
  key: string;
  fileUrl: string;
}

/**
 * Upload a file to UploadThing via the v7 REST API.
 * Uses prepareUpload to get a presigned URL, then PUTs the file.
 * Returns the uploaded file URL.
 */
export async function uploadFile(file: File): Promise<UploadThingFile> {
  console.log('[UploadThing] Starting upload for:', file.name, `(${file.size} bytes, ${file.type})`);

  // Step 1: Request presigned upload URL via v7 prepareUpload
  console.log('[UploadThing] Requesting presigned URL from v7/prepareUpload...');
  const response = await fetch('https://api.uploadthing.com/v7/prepareUpload', {
    method: 'POST',
    headers: {
      'x-uploadthing-api-key': getApiKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`UploadThing prepareUpload failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  const presignedUrl: string = data.url;
  const key: string = data.key;
  console.log('[UploadThing] Got presigned URL, key:', key);

  if (!presignedUrl || !key) {
    throw new Error('UploadThing prepareUpload did not return a valid presigned URL');
  }

  // Step 2: PUT the file to the presigned URL using FormData
  console.log('[UploadThing] Uploading file to presigned URL via PUT...');
  const formData = new FormData();
  formData.append('file', file);

  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    body: formData,
  });

  if (!uploadResponse.ok) {
    const text = await uploadResponse.text();
    console.error('[UploadThing] Upload PUT failed:', uploadResponse.status, text);
    throw new Error(`UploadThing file upload failed: ${uploadResponse.status} ${text}`);
  }

  const uploadResult = await uploadResponse.json();
  const fileUrl: string = uploadResult.url || uploadResult.ufsUrl || `https://utfs.io/f/${key}`;
  console.log('[UploadThing] Upload successful! URL:', fileUrl);

  return {
    id: key,
    name: file.name,
    size: file.size,
    url: fileUrl,
    key,
    fileUrl,
  };
}

/**
 * Upload multiple files to UploadThing.
 */
export async function uploadFiles(files: File[]): Promise<UploadThingFile[]> {
  const results = await Promise.all(files.map(uploadFile));
  return results;
}

/**
 * Delete a file from UploadThing.
 */
export async function deleteFile(fileKey: string): Promise<void> {
  console.log('[UploadThing] Deleting file with key:', fileKey);
  const response = await fetch('https://api.uploadthing.com/v6/deleteFiles', {
    method: 'POST',
    headers: {
      'x-uploadthing-api-key': getApiKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileKeys: [fileKey] }),
  });

  if (!response.ok) {
    console.error('[UploadThing] Delete failed:', response.status);
    throw new Error(`UploadThing delete failed: ${response.status}`);
  }
  console.log('[UploadThing] Delete successful for key:', fileKey);
}

function getApiKey(): string {
  // The token is base64-encoded JSON containing the API key
  try {
    const decoded = JSON.parse(atob(UPLOADTHING_TOKEN));
    return decoded.apiKey;
  } catch {
    // If it's already a raw key, return as-is
    return UPLOADTHING_TOKEN;
  }
}
