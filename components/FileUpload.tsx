

import React, { useState, useCallback } from 'react';
import { UploadIcon, CameraIcon } from './icons';
import CameraCaptureModal from './CameraCaptureModal';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleFileValidation = (files: FileList | File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB) 超出10MB限制`);
      } else if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} 不是有效的图片格式`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      alert(`部分文件无法上传:\n- ${errors.join('\n- ')}`);
    }

    if (validFiles.length > 0) {
      onFilesSelect(validFiles);
    }
  };
  
  const handleCapture = (file: File) => {
    setIsCameraOpen(false);
    if(file) {
      handleFileValidation([file]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileValidation(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileValidation(e.target.files);
    }
    e.target.value = '';
  };

  const activeDragStyle = isDragging ? 'border-[var(--primary)] bg-rose-50' : 'border-slate-300 bg-white';

  return (
    <>
      <div
        className={`relative w-full p-8 border-2 border-dashed rounded-lg transition-all duration-300 text-center ${activeDragStyle}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload-input"
          className="absolute w-full h-full opacity-0 cursor-pointer"
          // FIX: Add HEIC/HEIF for iOS compatibility
          accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
          onChange={handleFileChange}
          multiple
        />
        <div className="flex flex-col items-center">
          <UploadIcon className="w-12 h-12 text-slate-400 mb-4" />
          <div className="text-slate-600 font-semibold">
            <label htmlFor="file-upload-input" className="text-[var(--primary)] hover:text-[var(--primary-hover)] cursor-pointer font-bold">
              点击上传
            </label>
            <span className="mx-1">或</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsCameraOpen(true);
              }}
              className="inline-flex items-center gap-1 text-[var(--primary)] hover:text-[var(--primary-hover)] cursor-pointer font-bold"
            >
              <CameraIcon className="w-5 h-5" />
              拍照
            </button>
          </div>
           <p className="text-sm text-slate-500 mt-2">也可拖拽文件至此</p>
          {/* FIX: Update supported file types text to include formats for iOS. */}
          <p className="text-xs text-slate-400 mt-2">支持 PNG, JPG, WEBP, HEIC (最大 10MB)</p>
        </div>
      </div>
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
      />
    </>
  );
};

export default FileUpload;