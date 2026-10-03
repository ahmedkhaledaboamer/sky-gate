'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePermissions } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { subcategoriesApi } from '@/lib/api';
import { isMongoId, SUBCATEGORY_NAME_LENGTH } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { localized, refId } from '@/lib/product';
import { rules, validate } from '@/lib/validation';
import { invalidateCatalog, useCategories } from '@/hooks/useCatalogOptions';
import { useDashboardList, useDeleteFlow } from '@/hooks/useDashboardList';
import { useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/DataTable';
import { FormError, Input, Select } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { DashboardPageHeader, RowActions, TableFooter, Toolbar } from '../DashboardUI';

const { min, max } = SUBCATEGORY_NAME_LENGTH;

function SubcategoryForm({ subcategory, presetCategory, categoryOptions, onSaved, onCancel }) {
  const t = useTranslations('Dashboard');
  const toast = useToast();
  const isEdit = Boolean(subcategory);
  const form = useForm(
    {
      name: subcategory?.name ?? '',
      nameAr: subcategory?.nameAr ?? '',
      category: refId(subcategory?.category) ?? presetCategory ?? '',
    },
    (v) =>
      validate(v, {
        name: [
          rules.required(t('v.required')),
          rules.minLength(min, t('v.minLength', { min })),
          rules.maxLength(max, t('v.maxLength', { max })),
        ],
        nameAr: [rules.maxLength(max, t('v.maxLength', { max }))],
        category: [rules.required(t('v.categoryRequired'))],
      })
  );

  const onSubmit = form.handleSubmit(async (v) => {
    const body = { name: v.name.trim(), ...(v.nameAr.trim() || isEdit ? { nameAr: v.nameAr.trim() } : {}) };
    if (isEdit) {
      await subcategoriesApi.update(subcategory._id, { ...body, category: v.category });
    } else if (presetCategory && v.category === presetCategory) {
      // creating inside a filtered category: nested route POST /categories/:id/subcategory
      await subcategoriesApi.createForCategory(presetCategory, body);
    } else {
      await subcategoriesApi.create({ ...body, category: v.category });
    }
    toast.success(isEdit ? t('saved') : t('created'));
    onSaved();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormError message={form.formError} />
      <Select {...form.field('category')} label={t('product.category')} placeholder={t('select')} options={categoryOptions} required />
      <Input {...form.field('name')} label={t('fields.name')} maxLength={max} required />
      <Input {...form.field('nameAr')} label={t('fields.nameAr')} dir="rtl" maxLength={max} />
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={form.isSubmitting}>
          {t('cancel')}
        </Button>
        <Button type="submit" loading={form.isSubmitting}>
          {isEdit ? t('saveChanges') : t('create')}
        </Button>
      </div>
    </form>
  );
}

// GET /subcategories, or GET /categories/:categoryId/subcategory when filtered
const fetchSubcategories = ({ category, ...query }, options) =>
  category ? subcategoriesApi.listByCategory(category, query, options) : subcategoriesApi.list(query, options);

export function SubcategoriesAdminPage() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const { canDelete } = usePermissions();
  const categories = useCategories();
  const { query, list, page, keyword, setKeyword, setPage, params, setParams } = useDashboardList(
    'admin-subcategories',
    fetchSubcategories,
    (p) => ({ category: isMongoId(p.category) ? p.category : undefined })
  );
  const [editing, setEditing] = useState(null);
  const refresh = () => {
    invalidateCatalog('subcategories');
    query.refetch();
  };
  const del = useDeleteFlow(subcategoriesApi.remove, refresh);

  const categoryOptions = (categories.data ?? []).map((c) => ({ value: c._id, label: localized(c, 'name', locale) }));
  const categoryName = (id) => categoryOptions.find((o) => o.value === id)?.label ?? '—';
  const presetCategory = isMongoId(params.category) ? params.category : undefined;

  return (
    <>
      <DashboardPageHeader
        title={t('nav.subcategories')}
        description={t('subcategoriesDescription')}
        actions={
          <Button onClick={() => setEditing({})}>
            <Plus className="w-4 h-4" />
            {t('addSubcategory')}
          </Button>
        }
      />
      <Toolbar>
        <SearchInput value={keyword} onChange={setKeyword} placeholder={t('search')} className="sm:w-72" />
        <Select
          aria-label={t('product.category')}
          value={params.category ?? ''}
          onChange={(e) => setParams({ category: e.target.value })}
          placeholder={t('allCategories')}
          options={categoryOptions}
          className="sm:w-60"
        />
      </Toolbar>
      {query.error && !query.data ? (
        <ErrorState error={query.error} onRetry={query.refetch} />
      ) : (
        <DataTable
          isLoading={query.isLoading}
          rows={list.items}
          empty={<EmptyState title={t('noResults')} className="py-12" />}
          columns={[
            { key: 'name', header: t('fields.name'), render: (s) => <span className="font-semibold text-slate-900">{s.name}</span> },
            { key: 'nameAr', header: t('fields.nameAr'), render: (s) => <span dir="rtl">{s.nameAr || '—'}</span> },
            { key: 'category', header: t('col.category'), render: (s) => categoryName(refId(s.category)) },
            { key: 'createdAt', header: t('col.created'), render: (s) => formatDate(s.createdAt, locale) },
            {
              key: 'actions',
              header: <span className="sr-only">{t('col.actions')}</span>,
              render: (s) => (
                <RowActions
                  viewHref={`/products?category=${refId(s.category)}&subcategory=${s._id}`}
                  onEdit={() => setEditing(s)}
                  onDelete={canDelete ? () => del.request(s) : undefined}
                />
              ),
            },
          ]}
        />
      )}
      <TableFooter list={list} page={page} onPageChange={setPage} />

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?._id ? t('editSubcategory') : t('addSubcategory')}>
        {editing && (
          <SubcategoryForm
            key={editing._id ?? 'new'}
            subcategory={editing._id ? editing : null}
            presetCategory={presetCategory}
            categoryOptions={categoryOptions}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              refresh();
            }}
          />
        )}
      </Modal>
      <ConfirmModal {...del.modalProps} message={t('deleteMessage', { name: del.target?.name ?? '' })} />
    </>
  );
}
