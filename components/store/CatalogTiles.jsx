'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { localized } from '@/lib/product';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { Skeleton } from '@/components/ui/States';

export function CategoryTile({ category, subcategories = [] }) {
  const locale = useLocale();
  const name = localized(category, 'name', locale);
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-cardHover border border-slate-100 transition-shadow duration-500">
      <Link href={`/products?category=${category._id}`} className="block">
        {/* white background: the image is fitted inside instead of covering the card */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          <RemoteImage
            src={category.image}
            alt={name}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="px-4 pb-4 pt-1 flex items-center justify-between gap-2">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-tight group-hover:text-teal-600 transition-colors">
            {name}
          </h3>
          <span className="w-8 h-8 shrink-0 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
            <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
          </span>
        </div>
      </Link>
      {subcategories.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 p-4">
          {subcategories.map((sub) => (
            <li key={sub._id}>
              <Link
                href={`/products?category=${category._id}&subcategory=${sub._id}`}
                className="inline-block rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:border-teal-500 hover:text-teal-600"
              >
                {localized(sub, 'name', locale)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function BrandTile({ brand }) {
  const locale = useLocale();
  const name = localized(brand, 'name', locale);
  return (
    <Link
      href={`/products?brand=${brand._id}`}
      className="group flex flex-col items-center gap-3 bg-white rounded-3xl p-5 shadow-soft hover:shadow-card border border-transparent hover:border-teal-100 transition-all"
    >
      <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden bg-slate-50">
        {brand.image ? (
          <RemoteImage src={brand.image} alt={name} sizes="200px" className="object-contain p-3" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-serif text-4xl font-bold text-teal-600/70">
            {name.charAt(0)}
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-slate-800 group-hover:text-teal-600 text-center line-clamp-1">
        {name}
      </span>
    </Link>
  );
}

export function TileSkeletons({ count = 8, className = 'aspect-[4/3]' }) {
  return Array.from({ length: count }, (_, i) => <Skeleton key={i} className={`${className} rounded-3xl`} />);
}
