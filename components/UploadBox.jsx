"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileCheck2, X } from "lucide-react";

export default function UploadBox({ file, onFile, accept = ".pdf,.doc,.docx", label }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (files && files[0]) onFile(files[0]);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
            dragging
              ? "border-ready-500 bg-ready-50"
              : "border-line bg-paper-dim hover:border-ink-soft"
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
            <UploadCloud className="h-5 w-5 text-ink-soft" />
          </span>
          <span className="text-sm font-medium text-ink">
            {label || "Drop your CV here, or click to browse"}
          </span>
          <span className="text-xs text-ink-soft">PDF, DOC, or DOCX — up to 10MB</span>
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-ready-100 bg-ready-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <FileCheck2 className="h-5 w-5 flex-shrink-0 text-ready-600" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{file.name}</p>
              <p className="text-xs text-ink-soft">
                {(file.size / 1024).toFixed(0)} KB — ready to analyze
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFile(null)}
            aria-label="Remove file"
            className="rounded-full p-1.5 text-ink-soft transition hover:bg-white hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
