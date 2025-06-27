'use client';

import { useState } from 'react';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export default function FileUpload({ 
  onUpload, 
  accept = "image/*,.pdf", 
  multiple = false,
  maxSize = 10,
  className = ""
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max size is ${maxSize}MB`);
        return false;
      }
      return true;
    });

    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {accept.includes('image') && 'Images, '}
          {accept.includes('pdf') && 'PDFs, '}
          up to {maxSize}MB each
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
              </span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 