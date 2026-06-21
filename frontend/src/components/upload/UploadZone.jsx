import { useState, useRef } from "react";
import { isPdfFile } from "../../utils/validators";

export default function UploadZone({ onFileSelected, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!isPdfFile(file)) {
      setFileError("Solo se aceptan archivos PDF por ahora.");
      return;
    }
    setFileError(null);
    onFileSelected(file);
  };

  const handleDrop = (e) => {
  e.preventDefault();

  const files = Array.from(e.dataTransfer.files);

  onFileSelected(files);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`flex min-h-[260px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors
          ${isDragging ? "border-brand bg-brand/5" : "border-base-border bg-base"}
          ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-brand/60"}`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-xl text-white">
          ⬆
        </span>
        <p className="font-display text-base font-semibold text-ink">
          Suelta tu PDF aquí
        </p>
        <p className="text-sm text-ink-muted">
          o <span className="text-brand-glow underline">explora tus archivos</span> — hasta 50MB
        </p>
        <div className="mt-2 flex items-center gap-4 text-xs text-ink-faint">
          <span>⊞ Análisis con IA</span>
          <span>⚡ Quiz instantáneo</span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          disabled={disabled}
          onChange={(e) => onFileSelected(Array.from(e.target.files))}
        />
      </div>
      {fileError && <p className="mt-2 text-sm text-bad">{fileError}</p>}
    </div>
  );
}