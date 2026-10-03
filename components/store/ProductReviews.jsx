'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MessageSquareText, Pencil, Trash2 } from 'lucide-react';
import { useAuth, usePermissions } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { reviewsApi } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { readList } from '@/lib/listResponse';
import { refId } from '@/lib/product';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FormError, Input } from '@/components/ui/Field';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/States';
import { StarInput, StarRating } from '@/components/ui/StarRating';

const PAGE_SIZE = 5;

function ReviewForm({ productId, review, onSaved, onCancel }) {
  const t = useTranslations('Reviews');
  const toast = useToast();
  const form = useForm({ title: review?.title ?? '', ratings: review?.ratings ?? 0 }, (v) =>
    v.ratings >= 1 && v.ratings <= 5 ? {} : { ratings: t('ratingRequired') }
  );

  const onSubmit = form.handleSubmit(async ({ title, ratings }) => {
    const body = { title: title.trim() || undefined, ratings };
    if (review) await reviewsApi.update(review._id, body);
    else await reviewsApi.create(productId, body);
    toast.success(review ? t('updated') : t('created'));
    onSaved();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="bg-white rounded-3xl shadow-soft border border-slate-100 p-6 space-y-4">
      <h3 className="font-serif text-2xl font-bold text-slate-900">{review ? t('editTitle') : t('writeTitle')}</h3>
      <FormError message={form.formError} />
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1.5">
          {t('yourRating')} <span className="text-red-500">*</span>
        </p>
        <StarInput value={form.values.ratings} onChange={(n) => form.setValue('ratings', n)} label={t('yourRating')} />
        {form.errors.ratings && <p className="mt-1.5 text-xs font-medium text-red-600">{form.errors.ratings}</p>}
      </div>
      <Input {...form.field('title')} label={t('reviewText')} placeholder={t('reviewPlaceholder')} maxLength={300} />
      <div className="flex gap-3">
        <Button type="submit" loading={form.isSubmitting}>
          {review ? t('save') : t('submit')}
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={form.isSubmitting}>
            {t('cancel')}
          </Button>
        )}
      </div>
    </form>
  );
}

function ReviewItem({ review, isOwn, canDelete, onEdit, onDelete }) {
  const t = useTranslations('Reviews');
  const locale = useLocale();
  const name = review.user?.name ?? t('anonymous');
  return (
    <li className="py-5 border-b border-slate-100 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 shrink-0 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center">
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">
              {name}
              {isOwn && <span className="ms-2 text-xs font-medium text-teal-600">{t('you')}</span>}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating value={review.ratings} size="w-3.5 h-3.5" />
              <time className="text-xs text-slate-500" dateTime={review.createdAt}>
                {formatDate(review.createdAt, locale)}
              </time>
            </div>
            {review.title && <p className="mt-2 text-slate-700 leading-relaxed break-words">{review.title}</p>}
          </div>
        </div>
        {(isOwn || canDelete) && (
          <div className="flex gap-1 shrink-0">
            {isOwn && (
              <Button variant="ghost" size="iconSm" onClick={onEdit} aria-label={t('edit')} title={t('edit')}>
                <Pencil className="w-4 h-4" />
              </Button>
            )}
            <Button variant="dangerGhost" size="iconSm" onClick={onDelete} aria-label={t('delete')} title={t('delete')}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}

export function ProductReviews({ product, onRatingsChange }) {
  const t = useTranslations('Reviews');
  const toast = useToast();
  const { user, isAuthenticated, isCustomer } = useAuth();
  const { canDeleteReviews } = usePermissions();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const productId = product._id;

  const list = useApiQuery(
    ['reviews', productId, page],
    (signal) => reviewsApi.listForProduct(productId, { page, limit: PAGE_SIZE, sort: '-createdAt' }, { signal }),
    { keepPrevious: true }
  );
  // one review per user per product — find the logged user's own review
  const own = useApiQuery(
    isCustomer && user?._id ? ['my-review', productId, user._id] : null,
    (signal) => reviewsApi.listForProduct(productId, { user: user._id, limit: 1 }, { signal })
  );
  const ownReview = own.data?.data?.[0] ?? null;
  const { items, totalPages, hasNext, total } = readList(list.data);

  const refreshAll = () => {
    list.refetch();
    own.refetch();
    onRatingsChange?.();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await reviewsApi.remove(toDelete._id);
      toast.success(t('deleted'));
      setToDelete(null);
      setEditing(false);
      refreshAll();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section id="reviews" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">{t('title')}</h2>
          <div className="mt-2 flex items-center gap-3">
            <StarRating value={product.ratingsAverage} showValue size="w-5 h-5" />
            <span className="text-sm text-slate-500">{t('basedOn', { count: product.ratingsQuantity ?? total ?? 0 })}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 lg:order-2">
          {!isAuthenticated ? (
            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-6 text-center">
              <p className="text-slate-600 mb-4">{t('loginToReview')}</p>
              <Button href={`/login?next=${encodeURIComponent(`/products/${productId}#reviews`)}`}>{t('login')}</Button>
            </div>
          ) : !isCustomer ? null : own.isInitialLoading ? (
            <Skeleton className="h-56 rounded-3xl" />
          ) : ownReview && !editing ? (
            <div className="bg-teal-50/60 rounded-3xl border border-teal-100 p-6">
              <p className="text-sm font-semibold text-teal-700 mb-2">{t('alreadyReviewed')}</p>
              <StarRating value={ownReview.ratings} />
              {ownReview.title && <p className="mt-2 text-slate-700">{ownReview.title}</p>}
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  <Pencil className="w-4 h-4" />
                  {t('edit')}
                </Button>
                <Button size="sm" variant="dangerGhost" onClick={() => setToDelete(ownReview)}>
                  <Trash2 className="w-4 h-4" />
                  {t('delete')}
                </Button>
              </div>
            </div>
          ) : (
            <ReviewForm
              key={ownReview?._id ?? 'new'}
              productId={productId}
              review={editing ? ownReview : null}
              onCancel={editing ? () => setEditing(false) : undefined}
              onSaved={() => {
                setEditing(false);
                setPage(1);
                refreshAll();
              }}
            />
          )}
        </div>

        <div className="lg:col-span-3 lg:order-1">
          {list.error && !list.data ? (
            <ErrorState error={list.error} onRetry={list.refetch} className="py-10" />
          ) : list.isInitialLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState icon={MessageSquareText} title={t('emptyTitle')} description={t('emptyDescription')} className="py-10" />
          ) : (
            <>
              <ul className={`bg-white rounded-3xl shadow-soft border border-slate-100 px-6 ${list.isLoading ? 'opacity-60' : ''}`}>
                {items.map((review) => {
                  const isOwn = Boolean(user?._id) && refId(review.user) === user._id;
                  return (
                    <ReviewItem
                      key={review._id}
                      review={review}
                      isOwn={isOwn && isCustomer}
                      canDelete={canDeleteReviews}
                      onEdit={() => {
                        setEditing(true);
                        document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      onDelete={() => setToDelete(review)}
                    />
                  );
                })}
              </ul>
              <Pagination className="mt-6" page={page} totalPages={totalPages} hasNext={hasNext} onChange={setPage} />
            </>
          )}
          {!isAuthenticated && items.length > 0 && (
            <p className="mt-4 text-sm text-slate-500">
              <Link href="/login" className="font-semibold text-teal-600">
                {t('login')}
              </Link>{' '}
              {t('loginToReviewShort')}
            </p>
          )}
        </div>
      </div>

      <ConfirmModal
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        danger
        title={t('deleteTitle')}
        message={t('deleteMessage')}
        confirmLabel={t('delete')}
      />
    </section>
  );
}
