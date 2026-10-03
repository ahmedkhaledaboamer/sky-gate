import Image from 'next/image';

/** Shared frame for login / signup / password reset screens. */
export function AuthCard({ eyebrow, title, description, children, footer }) {
  return (
    <main className="min-h-screen bg-saudi-sand pt-32 pb-20 px-4">
      <div className="mx-auto w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-6 sm:p-10">
          <div className="text-center mb-8">
            <Image
              src="/images/logo2.png"
              alt=""
              width={587}
              height={425}
              sizes="80px"
              className="w-20 mx-auto mb-6"
            />
            {eyebrow && (
              <span className="inline-block text-xs font-semibold tracking-[0.2em] text-teal-600 uppercase mb-3">
                {eyebrow}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">{title}</h1>
            {description && <p className="mt-2 text-slate-500">{description}</p>}
          </div>
          {children}
        </div>
        {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
      </div>
    </main>
  );
}
