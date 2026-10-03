'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useLocale, useTranslations } from '@/lib/i18n';
import { localized } from '@/lib/product';
import { RATING_FILTERS } from '@/lib/constants';
import { useBrands, useCategories, useSubcategories } from '@/hooks/useCatalogOptions';
import { Button } from '@/components/ui/Button';
import { inputClasses } from '@/components/ui/Field';
import { Skeleton } from '@/components/ui/States';
import { StarRating } from '@/components/ui/StarRating';

function Section({ title, children }) {
  return (
    <section className="py-5 border-b border-slate-100 last:border-0">
      <h3 className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mb-3">{title}</h3>
      {children}
    </section>
  );
}

function OptionList({ options, value, onChange, allLabel, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    );
  }
  const items = [{ value: '', label: allLabel }, ...options];
  return (
    <ul className="space-y-1 max-h-64 overflow-y-auto pe-1">
      {items.map((option) => {
        const active = (value ?? '') === option.value;
        return (
          <li key={option.value || 'all'}>
            <button
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-start transition-colors ${
                active ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{option.label}</span>
              {active && <Check className="w-4 h-4 shrink-0" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function PriceFilter({ min, max, onApply }) {
  const t = useTranslations('Shop');
  const [from, setFrom] = useState(min ?? '');
  const [to, setTo] = useState(max ?? '');
  const invalid = from !== '' && to !== '' && Number(from) > Number(to);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!invalid) onApply(from, to);
      }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          inputMode="decimal"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder={t('priceMin')}
          aria-label={t('priceMin')}
          className={`${inputClasses(invalid)} py-2`}
        />
        <span className="text-slate-400">–</span>
        <input
          type="number"
          min="0"
          inputMode="decimal"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder={t('priceMax')}
          aria-label={t('priceMax')}
          className={`${inputClasses(invalid)} py-2`}
        />
      </div>
      {invalid && <p className="text-xs text-red-600">{t('priceRangeInvalid')}</p>}
      <Button type="submit" variant="outline" size="sm" block disabled={invalid}>
        {t('apply')}
      </Button>
    </form>
  );
}

/**
 * Sidebar filters (desktop) / drawer content (mobile).
 * `filters` = { category, subcategory, brand, minPrice, maxPrice, rating }
 */
export function FilterPanel({ filters, onChange, onClear, hideCategory = false }) {
  const t = useTranslations('Shop');
  const locale = useLocale();
  const categories = useCategories();
  const brands = useBrands();
  const subcategories = useSubcategories(filters.category || undefined);

  const toOptions = (list) =>
    (list ?? []).map((item) => ({ value: item._id, label: localized(item, 'name', locale) }));

  return (
    <div className="px-5">
      {!hideCategory && (
        <Section title={t('filterCategory')}>
          <OptionList
            options={toOptions(categories.data)}
            value={filters.category}
            isLoading={categories.isInitialLoading}
            allLabel={t('allCategories')}
            onChange={(category) => onChange({ category, subcategory: '' })}
          />
        </Section>
      )}

      {filters.category && (subcategories.data?.length ?? 0) > 0 && (
        <Section title={t('filterSubcategory')}>
          <OptionList
            options={toOptions(subcategories.data)}
            value={filters.subcategory}
            allLabel={t('allSubcategories')}
            onChange={(subcategory) => onChange({ subcategory })}
          />
        </Section>
      )}

      <Section title={t('filterBrand')}>
        <OptionList
          options={toOptions(brands.data)}
          value={filters.brand}
          isLoading={brands.isInitialLoading}
          allLabel={t('allBrands')}
          onChange={(brand) => onChange({ brand })}
        />
      </Section>

      <Section title={t('filterPrice')}>
        <PriceFilter
          key={`${filters.minPrice ?? ''}-${filters.maxPrice ?? ''}`}
          min={filters.minPrice}
          max={filters.maxPrice}
          onApply={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
        />
      </Section>

      <Section title={t('filterRating')}>
        <ul className="space-y-1">
          {RATING_FILTERS.map((r) => {
            const active = String(filters.rating ?? '') === String(r);
            return (
              <li key={r}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ rating: active ? '' : String(r) })}
                  className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                    active ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <StarRating value={r} size="w-3.5 h-3.5" />
                  <span>{t('andUp')}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Section>

      <div className="py-5">
        <Button variant="ghost" size="sm" block onClick={onClear}>
          {t('clearFilters')}
        </Button>
      </div>
    </div>
  );
}
