'use client';

import { useState } from 'react';
import { KeyRound, Plus } from 'lucide-react';
import { useAuth, usePermissions } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { usersApi, userImageUrl } from '@/lib/api';
import { ALL_ROLES, PASSWORD_MIN } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { useLocale, useTranslations } from '@/lib/i18n';
import { rules, validate } from '@/lib/validation';
import { useDashboardList, useDeleteFlow } from '@/hooks/useDashboardList';
import { useForm } from '@/hooks/useForm';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/DataTable';
import { FormError, Input, Select } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Thumb } from '@/components/ui/RemoteImage';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { DashboardPageHeader, RowActions, TableFooter, Toolbar } from '../DashboardUI';
import { ImageInput } from '../ImageInput';

const ROLE_TONE = { admin: 'dark', manager: 'teal', user: 'neutral' };

/** POST / PUT /users — multipart (profileImg). Password fields only on create. */
function UserForm({ user, onSaved, onCancel }) {
  const t = useTranslations('Dashboard');
  const tAuth = useTranslations('Auth');
  const tRoles = useTranslations('Roles');
  const toast = useToast();
  const isEdit = Boolean(user);
  const form = useForm(
    {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      role: user?.role ?? 'user',
      password: '',
      passwordConfirm: '',
      profileImg: null,
    },
    (v) =>
      validate(v, {
        name: [rules.required(tAuth('nameRequired')), rules.minLength(3, tAuth('nameMin'))],
        email: [rules.required(tAuth('emailRequired')), rules.email(tAuth('emailInvalid'))],
        phone: [rules.phone(t('v.phone'))],
        ...(isEdit
          ? {}
          : {
              password: [rules.required(tAuth('passwordRequired')), rules.password(tAuth('passwordMin', { min: PASSWORD_MIN }))],
              passwordConfirm: [rules.required(tAuth('passwordConfirmRequired')), rules.matches('password', tAuth('passwordMismatch'))],
            }),
      })
  );

  const onSubmit = form.handleSubmit(async (v) => {
    const fd = new FormData();
    fd.append('name', v.name.trim());
    // on edit the email is sent only when it changed (older API versions
    // rejected the user's own unchanged email as "already in use")
    if (!isEdit || v.email.trim().toLowerCase() !== String(user.email).toLowerCase()) {
      fd.append('email', v.email.trim());
    }
    if (v.phone.trim() || isEdit) fd.append('phone', v.phone.trim());
    fd.append('role', v.role);
    if (!isEdit) {
      fd.append('password', v.password);
      fd.append('passwordConfirm', v.passwordConfirm);
    }
    if (v.profileImg) fd.append('profileImg', v.profileImg);
    if (isEdit) await usersApi.update(user._id, fd);
    else await usersApi.create(fd);
    toast.success(isEdit ? t('saved') : t('created'));
    onSaved();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormError message={form.formError} />
      <div className="grid sm:grid-cols-2 gap-5">
        <Input {...form.field('name')} label={tAuth('name')} required />
        <Input {...form.field('email')} label={tAuth('email')} type="email" required />
        <Input {...form.field('phone')} label={t('fields.phone')} type="tel" hint={t('phoneHint')} />
        <Select
          {...form.field('role')}
          label={t('fields.role')}
          options={ALL_ROLES.map((r) => ({ value: r, label: tRoles(r) }))}
          required
        />
      </div>
      {!isEdit && (
        <div className="grid sm:grid-cols-2 gap-5">
          <PasswordInput {...form.field('password')} label={tAuth('password')} autoComplete="new-password" required />
          <PasswordInput {...form.field('passwordConfirm')} label={tAuth('passwordConfirm')} autoComplete="new-password" required />
        </div>
      )}
      <ImageInput
        label={t('fields.profileImg')}
        file={form.values.profileImg}
        currentUrl={userImageUrl(user?.profileImg)}
        onChange={(f) => form.setValue('profileImg', f)}
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

/** PUT /users/changeMyPassword/:id — { currentPassword, password, passwordConfirm } */
function ChangeUserPasswordForm({ user, onDone, onCancel }) {
  const t = useTranslations('Dashboard');
  const tAuth = useTranslations('Auth');
  const toast = useToast();
  const form = useForm({ currentPassword: '', password: '', passwordConfirm: '' }, (v) =>
    validate(v, {
      currentPassword: [rules.required(t('v.required'))],
      password: [rules.required(tAuth('passwordRequired')), rules.password(tAuth('passwordMin', { min: PASSWORD_MIN }))],
      passwordConfirm: [rules.required(tAuth('passwordConfirmRequired')), rules.matches('password', tAuth('passwordMismatch'))],
    })
  );
  const onSubmit = form.handleSubmit(async (v) => {
    await usersApi.changePassword(user._id, v);
    toast.success(t('passwordChanged'));
    onDone();
  });
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormError message={form.formError} />
      <PasswordInput {...form.field('currentPassword')} label={t('fields.currentPassword')} autoComplete="off" required />
      <PasswordInput {...form.field('password')} label={tAuth('newPassword')} autoComplete="new-password" required />
      <PasswordInput {...form.field('passwordConfirm')} label={tAuth('passwordConfirm')} autoComplete="new-password" required />
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={form.isSubmitting}>
          {t('cancel')}
        </Button>
        <Button type="submit" loading={form.isSubmitting}>
          {t('changePassword')}
        </Button>
      </div>
    </form>
  );
}

export function UsersAdminPage() {
  const t = useTranslations('Dashboard');
  const tRoles = useTranslations('Roles');
  const locale = useLocale();
  const { canDelete } = usePermissions();
  const { user: me } = useAuth();
  const { query, list, page, keyword, setKeyword, setPage, params, setParams } = useDashboardList(
    'admin-users',
    usersApi.list,
    (p) => ({ role: ALL_ROLES.includes(p.role) ? p.role : undefined })
  );
  const [editing, setEditing] = useState(null);
  const [passwordFor, setPasswordFor] = useState(null);
  const del = useDeleteFlow(usersApi.remove, () => query.refetch());

  return (
    <>
      <DashboardPageHeader
        title={t('nav.users')}
        description={t('usersDescription')}
        actions={
          <Button onClick={() => setEditing({})}>
            <Plus className="w-4 h-4" />
            {t('addUser')}
          </Button>
        }
      />
      <Toolbar>
        <SearchInput value={keyword} onChange={setKeyword} placeholder={t('searchUsers')} className="sm:w-72" />
        <Select
          aria-label={t('fields.role')}
          value={params.role ?? ''}
          onChange={(e) => setParams({ role: e.target.value })}
          placeholder={t('allRoles')}
          options={ALL_ROLES.map((r) => ({ value: r, label: tRoles(r) }))}
          className="sm:w-48"
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
            {
              key: 'image',
              header: t('col.image'),
              render: (u) =>
                u.profileImg ? (
                  <Thumb src={userImageUrl(u.profileImg)} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center">
                    {(u.name ?? '?').charAt(0).toUpperCase()}
                  </span>
                ),
            },
            {
              key: 'name',
              header: t('fields.name'),
              render: (u) => (
                <span className="font-semibold text-slate-900">
                  {u.name}
                  {u._id === me?._id && <span className="ms-2 text-xs font-medium text-teal-600">{t('you')}</span>}
                </span>
              ),
            },
            { key: 'email', header: t('fields.email') },
            { key: 'phone', header: t('fields.phone'), render: (u) => <span dir="ltr">{u.phone || '—'}</span> },
            { key: 'role', header: t('fields.role'), render: (u) => <Badge tone={ROLE_TONE[u.role]}>{tRoles(u.role)}</Badge> },
            {
              key: 'active',
              header: t('col.status'),
              render: (u) => (u.active === false ? <Badge tone="warning">{t('inactive')}</Badge> : <Badge tone="success">{t('activeUser')}</Badge>),
            },
            { key: 'createdAt', header: t('col.created'), render: (u) => formatDate(u.createdAt, locale) },
            {
              key: 'actions',
              header: <span className="sr-only">{t('col.actions')}</span>,
              render: (u) => (
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="iconSm" onClick={() => setPasswordFor(u)} aria-label={t('changePassword')} title={t('changePassword')}>
                    <KeyRound className="w-4 h-4" />
                  </Button>
                  <RowActions
                    onEdit={() => setEditing(u)}
                    onDelete={canDelete && u._id !== me?._id ? () => del.request(u) : undefined}
                  />
                </div>
              ),
            },
          ]}
        />
      )}
      <TableFooter list={list} page={page} onPageChange={setPage} />

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?._id ? t('editUser') : t('addUser')} size="lg">
        {editing && (
          <UserForm
            key={editing._id ?? 'new'}
            user={editing._id ? editing : null}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              query.refetch();
            }}
          />
        )}
      </Modal>
      <Modal
        open={Boolean(passwordFor)}
        onClose={() => setPasswordFor(null)}
        title={t('changePassword')}
        description={passwordFor?.email}
      >
        {passwordFor && (
          <ChangeUserPasswordForm key={passwordFor._id} user={passwordFor} onCancel={() => setPasswordFor(null)} onDone={() => setPasswordFor(null)} />
        )}
      </Modal>
      <ConfirmModal {...del.modalProps} message={t('deleteMessage', { name: del.target?.name ?? '' })} />
    </>
  );
}
