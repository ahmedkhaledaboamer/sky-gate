'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePermissions } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { brandsApi, categoriesApi } from '@/lib/api';
import { NAME_LENGTH } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { rules, validate } from '@/lib/validation';
import { invalidateCatalog } from '@/hooks/useCatalogOptions';
import { useDashboardList, useDeleteFlow } from '@/hooks/useDashboardList';
import { useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/DataTable';
import { FormError, Input } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Thumb } from '@/components/ui/RemoteImage';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { DashboardPageHeader, RowActions, TableFooter, Toolbar } from '../DashboardUI';
import { ImageInput } from '../ImageInput';

// Categories and brands share the same shape: multipart name, nameAr, image.
const RESOURCES = {
  categories: {
    api: categoriesApi,
    // required when creating; on edit the current image is kept unless replaced
    imageRequiredOnCreate: true,
    filterParam: 'category',
    keys: { title: 'nav.categories', description: 'categoriesDescription', add: 'addCategory', edit: 'editCategory' },
  },
  brands: {
    api: brandsApi,
    // optional — the current image is kept when no file is sent
    imageRequiredOnCreate: false,
    filterParam: 'brand',
    keys: { title: 'nav.brands', description: 'brandsDescription', add: 'addBrand', edit: 'editBrand' },
  },
};

function NameImageForm({ resource, entity, onSaved, onCancel }) {
  const t = useTranslations('Dashboard');
  const toast = useToast();
  const { api, imageRequiredOnCreate } = RESOURCES[resource];
  const isEdit = Boolean(entity);
  const imageRequired = imageRequiredOnCreate && !isEdit;
  const form = useForm({ name: entity?.name ?? '', nameAr: entity?.nameAr ?? '', image: null }, (v) =>
    validate(v, {
      name: [
        rules.required(t('v.required')),
        rules.minLength(NAME_LENGTH.min, t('v.minLength', { min: NAME_LENGTH.min })),
        rules.maxLength(NAME_LENGTH.max, t('v.maxLength', { max: NAME_LENGTH.max })),
      ],
      nameAr: [rules.maxLength(NAME_LENGTH.max, t('v.maxLength', { max: NAME_LENGTH.max }))],
      image: [rules.custom((f) => !imageRequired || Boolean(f), t('v.imageRequired'))],
    })
  );

  const onSubmit = form.handleSubmit(async (v) => {
    const fd = new FormData();
    fd.append('name', v.name.trim());
    if (v.nameAr.trim() || isEdit) fd.append('nameAr', v.nameAr.trim());
    if (v.image) fd.append('image', v.image);
    if (isEdit) await api.update(entity._id, fd);
    else await api.create(fd);
    toast.success(isEdit ? t('saved') : t('created'));
    onSaved();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormError message={form.formError} />
      <Input {...form.field('name')} label={t('fields.name')} maxLength={NAME_LENGTH.max} required />
      <Input {...form.field('nameAr')} label={t('fields.nameAr')} dir="rtl" maxLength={NAME_LENGTH.max} />
      <ImageInput
        label={t('fields.image')}
        required={imageRequired}
        error={form.errors.image}
        hint={isEdit ? t('keepImageHint') : imageRequired ? undefined : t('optionalImageHint')}
        file={form.values.image}
        currentUrl={entity?.image}
        onChange={(f) => form.setValue('image', f)}
      />
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

function NameImageAdminPage({ resource }) {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const { canDelete } = usePermissions();
  const { api, keys, filterParam } = RESOURCES[resource];
  const { query, list, page, keyword, setKeyword, setPage } = useDashboardList(`admin-${resource}`, api.list);
  // null = closed, {} = create, entity = edit
  const [editing, setEditing] = useState(null);
  const refresh = () => {
    invalidateCatalog(resource);
    query.refetch();
  };
  const del = useDeleteFlow(api.remove, refresh);

  return (
    <>
      <DashboardPageHeader
        title={t(keys.title)}
        description={t(keys.description)}
        actions={
          <Button onClick={() => setEditing({})}>
            <Plus className="w-4 h-4" />
            {t(keys.add)}
          </Button>
        }
      />
      <Toolbar>
        <SearchInput value={keyword} onChange={setKeyword} placeholder={t('search')} className="sm:w-72" />
      </Toolbar>
      {query.error && !query.data ? (
        <ErrorState error={query.error} onRetry={query.refetch} />
      ) : (
        <DataTable
          isLoading={query.isLoading}
          rows={list.items}
          empty={<EmptyState title={t('noResults')} className="py-12" />}
          columns={[
            { key: 'image', header: t('col.image'), render: (c) => <Thumb src={c.image} alt="" /> },
            { key: 'name', header: t('fields.name'), render: (c) => <span className="font-semibold text-slate-900">{c.name}</span> },
            { key: 'nameAr', header: t('fields.nameAr'), render: (c) => <span dir="rtl">{c.nameAr || '—'}</span> },
            { key: 'slug', header: t('col.slug'), render: (c) => <code className="text-xs text-slate-500">{c.slug ?? '—'}</code> },
            { key: 'createdAt', header: t('col.created'), render: (c) => formatDate(c.createdAt, locale) },
            {
              key: 'actions',
              header: <span className="sr-only">{t('col.actions')}</span>,
              render: (c) => (
                <RowActions
                  viewHref={`/products?${filterParam}=${c._id}`}
                  onEdit={() => setEditing(c)}
                  onDelete={canDelete ? () => del.request(c) : undefined}
                />
              ),
            },
          ]}
        />
      )}
      <TableFooter list={list} page={page} onPageChange={setPage} />

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?._id ? t(keys.edit) : t(keys.add)}>
        {editing && (
          <NameImageForm
            key={editing._id ?? 'new'}
            resource={resource}
            entity={editing._id ? editing : null}
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

export function CategoriesAdminPage() {
  return <NameImageAdminPage resource="categories" />;
}

export function BrandsAdminPage() {
  return <NameImageAdminPage resource="brands" />;
}
