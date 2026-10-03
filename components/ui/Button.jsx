import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-slate-900 text-white hover:bg-teal-500 shadow-soft hover:shadow-card',
  teal: 'bg-teal-500 text-white hover:bg-teal-600 shadow-soft hover:shadow-card',
  outline:
    'bg-white border border-slate-200 text-slate-900 hover:border-teal-500 hover:text-teal-600 shadow-soft',
  ghost: 'text-slate-700 hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-soft',
  dangerGhost: 'text-red-600 hover:bg-red-50',
};

const SIZES = {
  xs: 'h-8 px-3 text-xs gap-1.5',
  sm: 'h-9 px-4 text-sm gap-2',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-12 px-8 text-base gap-2.5',
  icon: 'h-10 w-10 justify-center',
  iconSm: 'h-8 w-8 justify-center',
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
} = {}) {
  return [
    'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
    VARIANTS[variant],
    SIZES[size],
    block ? 'w-full' : '',
    className,
  ].join(' ');
}

/** Button or Link (when `href` is given) with loading state. */
export function Button({
  href,
  variant,
  size,
  block,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}) {
  const classes = buttonClasses({ variant, size, block, className });
  const content = (
    <>
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
      {children}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  );
}
