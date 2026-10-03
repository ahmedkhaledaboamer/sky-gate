'use client';

import { useId } from 'react';
import { ChevronDown } from 'lucide-react';

export const inputClasses = (error) =>
  [
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400',
    'transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500',
    error
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-teal-500 focus:ring-teal-100',
  ].join(' ');

/** Label + control + hint / error message (wired with aria attributes). */
export function FieldShell({ id, label, required, hint, error, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-slate-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ms-0.5">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id, error, hint) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function Input({ label, error, hint, required, className, icon: Icon, ...props }) {
  const autoId = useId();
  const id = props.id ?? autoId;
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <div className="relative">
        {Icon && (
          <Icon className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        <input
          id={id}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={`${inputClasses(error)} ${Icon ? 'ps-11' : ''}`}
          {...props}
        />
      </div>
    </FieldShell>
  );
}

export function Textarea({ label, error, hint, required, className, rows = 4, ...props }) {
  const autoId = useId();
  const id = props.id ?? autoId;
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${inputClasses(error)} resize-y`}
        {...props}
      />
    </FieldShell>
  );
}

/** options: [{ value, label }] */
export function Select({ label, error, hint, required, className, options = [], placeholder, ...props }) {
  const autoId = useId();
  const id = props.id ?? autoId;
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={`${inputClasses(error)} appearance-none pe-10 cursor-pointer`}
          {...props}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </FieldShell>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {message}
    </div>
  );
}
