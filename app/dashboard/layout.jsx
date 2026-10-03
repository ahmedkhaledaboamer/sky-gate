import { Suspense } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { LoadingState } from '@/components/ui/States';

// Separate layout (no store header/footer). Access: admin + manager only —
// enforced in <DashboardShell> (client guard) and by the API on every request.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return (
    <DashboardShell>
      <Suspense fallback={<LoadingState />}>{children}</Suspense>
    </DashboardShell>
  );
}
