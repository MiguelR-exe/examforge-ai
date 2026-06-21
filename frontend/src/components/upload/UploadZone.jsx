import { useState, useRef } from "react";
import { Upload, Layers, Zap } from "lucide-react";
import { isPdfFile } from "../../utils/validators";

/**
 * Zona de drag & drop + selector de archivos.
 * Acepta múltiples PDFs: filtra cualquier archivo que no sea PDF
 * y reporta el rechazo en `fileError`, en vez de pasarlo silenciosamente
 * al callback (antes `handleFile`/`isPdfFile` no se llamaban nunca).
 */
export default function UploadZone({ onFileSelected, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const validFiles = files.filter(isPdfFile);
    const rejectedCount = files.length - validFiles.length;

    if (rejectedCount > 0) {
      setFileError(
        validFiles.length > 0
          ? `${rejectedCount} archivo(s) ignorado(s): solo se aceptan PDF por ahora.`
          : "Solo se aceptan archivos PDF por ahora."
      );
    } else {
      setFileError(null);
    }

    if (validFiles.length > 0) {
      onFileSelected(validFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
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
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
          <Upload className="h-5 w-5" strokeWidth={2} />
        </span>
        <p className="font-display text-base font-semibold text-ink">
          Suelta tu PDF aquí
        </p>
        <p className="text-sm text-ink-muted">
          o <span className="text-brand-glow underline">explora tus archivos</span> — hasta 50MB
        </p>
        <div className="mt-2 flex items-center gap-4 text-xs text-ink-faint">
          <span className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" strokeWidth={1.5} /> Análisis con IA
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" strokeWidth={1.5} /> Quiz instantáneo
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            handleFiles(e.target.files);
            // Permite re-seleccionar el mismo archivo después de un error
            e.target.value = "";
          }}
        />
      </div>
      {fileError && <p className="mt-2 text-sm text-bad">{fileError}</p>}
    </div>
  );
}