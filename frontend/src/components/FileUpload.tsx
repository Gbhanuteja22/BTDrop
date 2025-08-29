import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadFiles } from '../lib/api';
import { 
  formatFileSize, 
  getFileValidationError, 
  MAX_TOTAL_SIZE,
  getTotalFileSize 
} from '../lib/fileUtils';

type ShareType = '1-1' | '1-many';

function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [shareType, setShareType] = useState<ShareType>('1-1');
  const [isDragOver, setIsDragOver] = useState(false);
  const [hoveredShareType, setHoveredShareType] = useState<ShareType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useMutation({
    mutationFn: (data: { files: File[], shareType: ShareType }) => 
      uploadFiles(data.files, data.shareType),
    onError: (error) => {
      console.error('Upload error:', error);
    }
  });
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelection(droppedFiles);
  };
  const handleFileSelection = (selectedFiles: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];
    for (const file of selectedFiles) {
      const error = getFileValidationError(file, [...files, ...validFiles]);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
    if (errors.length > 0) {
      alert(errors.join('\n'));
    }
  };
  const removeFile = (index: number) => {
    setFiles(files => files.filter((_, i) => i !== index));
  };
  const handleUpload = () => {
    if (files.length > 0) {
      uploadMutation.mutate({ files, shareType });
    }
  };
  if (uploadMutation.isPending) {
    return (
      <div className="text-center space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="space-y-2">
            <p className="text-2xl font-light text-white">Uploading files...</p>
            <p className="text-white/50 font-light">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }
  if (uploadMutation.isSuccess) {
    return (
      <div className="text-center space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-4">
            <p className="text-2xl font-light text-white">Files uploaded successfully!</p>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-white/70 font-light mb-3">Share this code:</p>
              <div className="text-4xl font-light text-white tracking-wider font-mono">
                {uploadMutation.data?.data?.code}
              </div>
            </div>
            <p className="text-white/40 text-sm font-light">
              Code expires in 24 hours
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setFiles([]);
            uploadMutation.reset();
          }}
          className="px-8 py-4 bg-white text-black rounded-2xl font-light text-lg hover:bg-gray-100 transition-all duration-300 magic-button glow-interactive"
        >
          Upload More Files
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="space-y-4">
        <h3 className="text-2xl font-light text-white">Upload Files</h3>
        <div className="flex glass-morph p-1 rounded-2xl gap-1 w-fit mx-auto">
          <button
            onClick={() => setShareType('1-1')}
            onMouseEnter={() => setHoveredShareType('1-1')}
            onMouseLeave={() => setHoveredShareType(null)}
            className={`px-4 py-2 rounded-xl font-light text-sm transition-all duration-300 ${
              hoveredShareType === '1-1'
                ? 'bg-white text-black shadow-lg'
                : hoveredShareType === '1-many'
                ? 'text-white/30'
                : shareType === '1-1'
                ? 'bg-white text-black shadow-lg'
                : 'text-white/60'
            }`}
          >
            One-to-One
          </button>
          <button
            onClick={() => setShareType('1-many')}
            onMouseEnter={() => setHoveredShareType('1-many')}
            onMouseLeave={() => setHoveredShareType(null)}
            className={`px-4 py-2 rounded-xl font-light text-sm transition-all duration-300 ${
              hoveredShareType === '1-many'
                ? 'bg-white text-black shadow-lg'
                : hoveredShareType === '1-1'
                ? 'text-white/30'
                : shareType === '1-many'
                ? 'bg-white text-black shadow-lg'
                : 'text-white/60'
            }`}
          >
            One-to-Many
          </button>
        </div>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 hover:border-white/30 min-h-[150px] flex items-center justify-center ${
          isDragOver 
            ? 'border-white/50 bg-white/[0.02] scale-[1.02]' 
            : 'border-white/20 hover:bg-white/[0.01]'
        }`}
      >
        <div className="space-y-4">
          <svg 
            className="w-12 h-12 text-white/40 mx-auto" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <div className="space-y-1">
            <p className="text-lg font-light text-white">
              {isDragOver ? 'Drop files here' : 'Drop files or click to browse'}
            </p>
            <p className="text-white/40 font-light text-sm">
              Any number of files, {formatFileSize(MAX_TOTAL_SIZE)} total limit
            </p>
            {files.length > 0 && (
              <p className="text-white/60 font-light text-xs">
                Used: {formatFileSize(getTotalFileSize(files))} / {formatFileSize(MAX_TOTAL_SIZE)}
              </p>
            )}
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelection(Array.from(e.target.files));
          }
        }}
      />
      {files.length > 0 && (
        <div className="flex-1 flex flex-col min-h-0 py-2">
          <h4 className="text-lg font-light text-white mb-3">Selected Files ({files.length})</h4>
          <div className="flex-1 overflow-y-auto space-y-3 max-h-64">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-light text-sm truncate">{file.name}</p>
                    <p className="text-white/40 text-xs font-light">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ml-2"
                >
                  <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {files.length > 0 && (
        <div className="mt-auto pt-4">
          <button
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="w-full py-3 bg-white text-black rounded-xl font-light text-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload Files
          </button>
        </div>
      )}
      {uploadMutation.error && (
        <div className="apple-glass rounded-2xl p-6 border border-red-500/20 bg-red-500/5">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-red-400 font-light">Upload failed</p>
              <p className="text-red-400/60 text-sm font-light">
                {uploadMutation.error?.message || 'Unknown error'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
