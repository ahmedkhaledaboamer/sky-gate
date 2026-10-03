'use client';

import { useEffect, useId, useMemo, useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { FieldShell } from '@/components/ui/Field';

const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif';

/** Object URLs for File previews, revoked on change / unmount. */
function useObjectUrls(files) {
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);
  return urls;
}

function Preview({ src, onRemove, label }) {
  return (
    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
      {/* eslint-disable-next-line @next/next/no-img-element -- blob: / API previews */}
      <img src={src} alt="" className="w-full h-full object-cover" />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={label}
          className="absolute top-1 end-1 w-6 h-6 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function PickButton({ inputId, label }) {
  return (
    <label
      htmlFor={inputId}
      className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 text-slate-500 hover:border-teal-500 hover:text-teal-600 cursor-pointer transition-colors"
    >
      <ImagePlus className="w-6 h-6" />
      <span className="text-[11px] font-semibold text-center px-1">{label}</span>
    </label>
  );
}

/** Single image: shows the current (URL) image or the newly picked file. */
export function ImageInput({ label, required, error, hint, file, currentUrl, onChange }) {
  const t = useTranslations('Dashboard');
  const id = useId();
  const inputRef = useRef(null);
  const files = useMemo(() => (file ? [file] : []), [file]);
  const [preview] = useObjectUrls(files);
  const shown = preview ?? currentUrl;

  return (
    <FieldShell id={id} label={label} required={required} error={error} hint={hint}>
      <div className="flex items-center gap-3">
        {shown && (
          <Preview
            src={shown}
            label={t('removeImage')}
            onRemove={file ? () => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = '';
            } : undefined}
          />
        )}
        <PickButton inputId={id} label={shown ? t('changeImage') : t('chooseImage')} />
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
    </FieldShell>
  );
}

/**
 * Multiple images: existing URLs (kept unless removed) + new files, up to `max`.
 */
export function MultiImageInput({ label, error, hint, existing = [], onExistingChange, files = [], onFilesChange, max = 5 }) {
  const t = useTranslations('Dashboard');
  const id = useId();
  const previews = useObjectUrls(files);
  const remaining = max - existing.length - files.length;

  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className="flex flex-wrap items-center gap-3">
        {existing.map((url) => (
          <Preview
            key={url}
            src={url}
            label={t('removeImage')}
            onRemove={() => onExistingChange(existing.filter((u) => u !== url))}
          />
        ))}
        {previews.map((url, i) => (
          <Preview
            key={url}
            src={url}
            label={t('removeImage')}
            onRemove={() => onFilesChange(files.filter((_, j) => j !== i))}
          />
        ))}
        {remaining > 0 && <PickButton inputId={id} label={t('addImages', { count: remaining })} />}
        <input
          id={id}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          onChange={(e) => {
            const picked = Array.from(e.target.files ?? []).slice(0, Math.max(remaining, 0));
            onFilesChange([...files, ...picked]);
            e.target.value = '';
          }}
        />
      </div>
    </FieldShell>
  );
}
