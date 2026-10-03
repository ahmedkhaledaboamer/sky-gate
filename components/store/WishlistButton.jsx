'use client';

import { Heart } from 'lucide-react';
import { useCanShop } from '@/context/AuthContext';
import { useWishlistItem } from '@/context/WishlistContext';
import { useTranslations } from '@/lib/i18n';

/** Heart toggle; hidden for staff accounts (wishlist is a customer feature). */
export function WishlistButton({ productId, className = '', withLabel = false }) {
  const canShop = useCanShop();
  const { active, pending, toggle } = useWishlistItem(productId);
  const t = useTranslations('Wishlist');
  if (!canShop) return null;

  const label = active ? t('remove') : t('add');
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      disabled={pending}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center gap-2 rounded-full transition-all disabled:opacity-60 ${
        active ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
      } ${className}`}
    >
      <Heart className={`w-5 h-5 ${active ? 'fill-red-500' : ''}`} />
      {withLabel && <span className="text-sm font-semibold">{label}</span>}
    </button>
  );
}
