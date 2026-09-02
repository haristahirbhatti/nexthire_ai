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
          className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center transition ${
            dragging
              ? "border-gold-500 bg-canvas-card"
              : "border-canvas-border bg-canvas-mid hover:border-text-muted hover:bg-canvas-card"
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas-raised text-gold-500">
            <UploadCloud className="h-6 w-6" />
          </span>
          <div>
            <p className="text-base font-semibold text-text-primary">
              {label || "Upload your CV for analysis"}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              PDF, DOC, DOCX or image — drag &amp; drop supported
            </p>
          </div>
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-gold-500/40 bg-canvas-card px-5 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <FileCheck2 className="h-5 w-5 flex-shrink-0 text-gold-500" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">{file.name}</p>
              <p className="text-xs text-text-secondary">
                {(file.size / 1024).toFixed(0)} KB — ready for analysis
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFile(null)}
            aria-label="Remove file"
            className="rounded-full p-1.5 text-text-secondary transition hover:bg-canvas-raised hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
