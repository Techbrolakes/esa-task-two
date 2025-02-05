import React, { useCallback, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import Image from "next/image";
import queries from "@/lib/queries";
import { toast } from "react-toastify";

interface LogoUploaderProps {
  onUploadComplete: (s3Key: string) => void;
  initialLogoKey?: string; 
  error?: { message?: string };
  label?: string;
}

export default function LogoUploader({ onUploadComplete, initialLogoKey, error, label }: LogoUploaderProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const MAX_FILE_SIZE_MB = 2; // Max file size in MB

  const [getSignedUrl] = useLazyQuery(queries.GET_SIGNED_UPLOAD_URL);
  const [getDownloadUrl] = useLazyQuery(queries.GET_SIGNED_DOWNLOAD_URL);

  /** Function to fetch logo URL using the S3 key */
  const fetchLogoUrl = useCallback(
    async (s3Key: string) => {
      try {
        const { data } = await getDownloadUrl({
          variables: { s3Key },
        });
        if (data?.getSignedDownloadUrl?.url) {
          setLogoUrl(data.getSignedDownloadUrl.url);
        }
      } catch (error) {
        console.error("Failed to fetch logo:", error);
      }
    },
    [getDownloadUrl]
  );

  /** Uploading a file */
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check file size (2MB limit)
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File must be smaller than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    try {
      setUploading(true);
      setFileError(null);

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

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setLogoUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);

      onUploadComplete(data.getSignedUploadUrl.key);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  /** Handling file selection */
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  /** Drag & Drop Handling */
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

  /** Fetch logo if initialLogoKey is available */
  useEffect(() => {
    if (initialLogoKey) {
      fetchLogoUrl(initialLogoKey);
    }
  }, [initialLogoKey, fetchLogoUrl]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {label && <div className="mb-3 font-medium text-gray-200">{label}</div>}

      <div
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : error || fileError
            ? "border-red-500"
            : "border-gray-600 hover:border-blue-500"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input type="file" id="logo-upload" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />

        <label htmlFor="logo-upload" className="flex flex-col items-center cursor-pointer">
          {logoUrl ? (
            <Image src={logoUrl} alt="Company logo" className="rounded-lg object-contain" width={120} height={120} />
          ) : (
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}

          <span className="text-gray-200 text-lg mb-2">{uploading ? "Uploading..." : "Drop logo here or click to upload"}</span>
          <span className="text-gray-400 text-sm">PNG, JPG up to 2MB</span>
        </label>
      </div>

      {fileError && <p className="mt-2 text-sm text-red-500">{fileError}</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
