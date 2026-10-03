'use client';

import { Children } from 'react';
import { useLocale } from '@/lib/i18n';

const MIN_ITEMS = 8;

/**
 * Single-row, continuously scrolling strip (logos, categories…).
 * - the items are rendered twice and the track moves by exactly one copy,
 *   so the loop is seamless; the copy is hidden from screen readers
 * - pauses on hover / keyboard focus, follows the reading direction (RTL)
 * - uses a named group (group/marquee) so the cards' own `group-hover`
 *   styles react only to the card under the pointer
 * - with "reduce motion" it becomes a normal horizontally scrollable row
 */
export function Marquee({ children, speed = 4, className = '', itemClassName = '', label }) {
  const locale = useLocale();
  let items = Children.toArray(children);
  if (!items.length) return null;
  // short lists are repeated so one copy is always wider than the screen
  while (items.length < MIN_ITEMS) items = [...items, ...Children.toArray(children)];
  const duration = `${items.length * speed}s`;

  const renderCopy = (copy) =>
    items.map((child, i) => (
      <li
        key={`${copy}-${i}`}
        className={`shrink-0 pe-4 sm:pe-6 ${itemClassName}`}
        aria-hidden={copy === 1 || undefined}
        inert={copy === 1 ? true : undefined}
      >
        {child}
      </li>
    ));

  return (
    <div
      role="region"
      aria-label={label}
      className={`group/marquee relative overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] ${className}`}
    >
      <ul
        className={`flex w-max py-2 group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused] motion-reduce:animate-none ${
          locale === 'ar' ? 'animate-marquee-rtl' : 'animate-marquee'
        }`}
        style={{ animationDuration: duration }}
      >
        {renderCopy(0)}
        {renderCopy(1)}
      </ul>
    </div>
  );
}
