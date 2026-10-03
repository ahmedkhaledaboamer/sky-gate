'use client';

import { useCallback, useState } from 'react';

/**
 * Form state + validation + API error mapping.
 *
 * - `validate(values)` returns { field: message } (empty = valid)
 * - API validation errors ({ errors: [{ path, msg }] }) are shown under the
 *   matching field; any other API error goes to `formError`.
 */
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  /** Spread onto inputs: <Input {...field('email')} /> */
  const field = (name) => ({
    name,
    value: values[name] ?? '',
    error: errors[name],
    onChange: (e) =>
      setValue(
        name,
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
      ),
  });

  const applyApiError = useCallback(
    (err) => {
      const fieldErrors = err?.fieldErrors ?? {};
      const known = Object.keys(fieldErrors).filter((k) => k in values);
      if (known.length) {
        setErrors(
          Object.fromEntries(known.map((k) => [k, fieldErrors[k]]))
        );
        const others = Object.keys(fieldErrors).filter((k) => !known.includes(k));
        setFormError(others.length ? fieldErrors[others[0]] : '');
      } else {
        setFormError(err?.message || 'Something went wrong');
      }
    },
    [values]
  );

  const handleSubmit = (onSubmit) => async (event) => {
    event?.preventDefault?.();
    setFormError('');
    const found = validate ? validate(values) : {};
    setErrors(found);
    if (Object.keys(found).length) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      applyApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = useCallback((next) => {
    setValues(next);
    setErrors({});
    setFormError('');
  }, []);

  return {
    values,
    errors,
    formError,
    isSubmitting,
    field,
    setValue,
    setErrors,
    setFormError,
    handleSubmit,
    reset,
  };
}
