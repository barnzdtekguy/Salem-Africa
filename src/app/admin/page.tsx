import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { getStaffContext } from '@/lib/auth';
import { logServerError } from '@/lib/security/diagnostics';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let staff;
  try {
    staff = await getStaffContext();
  } catch (error) {
    logServerError('admin_dashboard_unavailable', error);
    return (
      <main className="admin-auth-page">
        <section className="admin-auth-card" aria-labelledby="admin-unavailable-heading">
          <p className="admin-eyebrow">Salem Africa staff</p>
          <h1 id="admin-unavailable-heading">Dashboard temporarily unavailable</h1>
          <p>We could not verify your staff session. Please try again later.</p>
        </section>
      </main>
    );
  }
  if (!staff) redirect('/admin/login');
  return <AdminDashboard staff={staff} />;
}
