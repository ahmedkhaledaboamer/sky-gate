'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { Input } from '@/components/ui/Field';

/** Password field with a show / hide toggle. */
export function PasswordInput(props) {
  const [visible, setVisible] = useState(false);
  const t = useTranslations('Auth');
  return (
    <div className="relative">
      <Input {...props} icon={Lock} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t('hidePassword') : t('showPassword')}
        className={`absolute end-3 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 ${props.label ? 'top-[34px]' : 'top-1.5'}`}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
