import React, { useState } from 'react';

interface ImageUploaderProps {
  onUploadComplete: (fileUrl: string) => void;
  bucket: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete, bucket }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('supabase_token');
      const signedUrlResponse = await fetch('/api/v1/admin/media/signed-upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ file_name: file.name }),
      });

      if (!signedUrlResponse.ok) {
        const errData = await signedUrlResponse.json();
        throw new Error(errData.message || 'Could not get an upload URL.');
      }

      const signedUrlData = await signedUrlResponse.json();
      const { signedURL, path } = signedUrlData;

      const uploadResponse = await fetch(signedURL, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload to storage failed.');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
          throw new Error("Supabase URL is not configured in environment variables.");
      }
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;

      onUploadComplete(publicUrl);

    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred during upload.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-1">Upload Image</label>
      <input
        id="image-upload"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
      />
      {uploading && <p className="text-sm text-blue-400 mt-2">Uploading, please wait...</p>}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;
