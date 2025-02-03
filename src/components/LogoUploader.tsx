import React, { useCallback, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import Image from "next/image";
import queries from "@/lib/queries";

interface LogoUploaderProps {
  onUploadComplete: (s3Key: string) => void;
  initialLogoKey?: string;
  error?: { message?: string };
  label?: string;
}

export default function LogoUploader({ onUploadComplete, initialLogoKey, error, label }: LogoUploaderProps) {
  const [logoUrl, setLogoUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [getSignedUrl] = useLazyQuery(queries.GET_SIGNED_UPLOAD_URL);
  const [getDownloadUrl] = useLazyQuery(queries.GET_SIGNED_DOWNLOAD_URL);

  const fetchLogoUrl = useCallback(
    async (s3Key: string) => {
      const { data } = await getDownloadUrl({
        variables: { s3Key },
      });
      setLogoUrl(data?.getSignedDownloadUrl.url);
    },
    [getDownloadUrl]
  );

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    try {
      setUploading(true);
      const { data } = await getSignedUrl({
        variables: {
          input: {
            fileName: file.name,
            contentType: file.type,
          },
        },
      });

      await fetch(data.getSignedUploadUrl.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      onUploadComplete(data.getSignedUploadUrl.key);
      await fetchLogoUrl(data.getSignedUploadUrl.key);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  React.useEffect(() => {
    if (initialLogoKey) {
      fetchLogoUrl(initialLogoKey);
    }
  }, [initialLogoKey, fetchLogoUrl]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {label && <div className="mb-3 font-medium text-gray-200">{label}</div>}

      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          isDragging ? "border-blue-500 bg-blue-500/10" : error ? "border-red-500" : "border-gray-600 hover:border-blue-500"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" id="logo-upload" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />

        <label htmlFor="logo-upload" className="flex flex-col items-center cursor-pointer">
          <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <span className="text-gray-200 text-lg mb-2">{uploading ? "Uploading..." : "Drop logo here or click to upload"}</span>
          <span className="text-gray-400 text-sm">PNG, JPG up to 5MB</span>
        </label>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}

      {logoUrl && (
        <div className="mt-6 w-32 h-32 relative mx-auto">
          <Image src={logoUrl} alt="Company logo" className="rounded-lg object-contain" width={200} height={200} />
        </div>
      )}
    </div>
  );
}
