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
 * Upload a file to UploadThing via the REST API.
 * Returns the uploaded file URL.
 */
export async function uploadFile(file: File): Promise<UploadThingFile> {
  // Step 1: Request upload URL
  const response = await fetch('https://api.uploadthing.com/v6/uploadFiles', {
    method: 'POST',
    headers: {
      'x-uploadthing-api-key': getApiKey(),
      'x-uploadthing-version': '6.0.0',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: [
        {
          name: file.name,
          size: file.size,
          type: file.type,
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`UploadThing upload URL request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  const uploadData = data[0];

  if (uploadData.error) {
    throw new Error(`UploadThing error: ${uploadData.error}`);
  }

  // Step 2: Upload file to the presigned URL
  const formData = new FormData();
  for (const [key, value] of Object.entries(uploadData.fields)) {
    formData.append(key, value as string);
  }
  formData.append('file', file);

  const uploadResponse = await fetch(uploadData.url, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    const text = await uploadResponse.text();
    throw new Error(`UploadThing file upload failed: ${uploadResponse.status} ${text}`);
  }

  const uploadResult = await uploadResponse.json();
  const fileData = uploadResult.files?.[0] || uploadResult;

  return {
    id: fileData.id || uploadData.id,
    name: file.name,
    size: file.size,
    url: fileData.ufsUrl || fileData.url || uploadData.fileUrl,
    key: fileData.key || uploadData.key,
    fileUrl: fileData.ufsUrl || fileData.url || uploadData.fileUrl,
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
  const response = await fetch('https://api.uploadthing.com/v6/deleteFiles', {
    method: 'POST',
    headers: {
      'x-uploadthing-api-key': getApiKey(),
      'x-uploadthing-version': '6.0.0',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileKeys: [fileKey] }),
  });

  if (!response.ok) {
    throw new Error(`UploadThing delete failed: ${response.status}`);
  }
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
