const TONES = {
  neutral: 'bg-slate-100 text-slate-700',
  teal: 'bg-teal-50 text-teal-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  dark: 'bg-slate-900 text-white',
  terra: 'bg-terra-soft text-terra-deep',
};

export function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
