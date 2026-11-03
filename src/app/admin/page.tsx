import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { getStaffContext } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const staff = await getStaffContext();
  if (!staff) redirect('/admin/login');
  return <AdminDashboard staff={staff} />;
}
