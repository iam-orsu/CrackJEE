'use client';

import { useParams, useRouter } from 'next/navigation';
import { StudentDetail } from '../../details';
import { useSuperAdmin } from '@/components/superadmin/superadmin-context';

export default function SuperAdminStudentDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const router = useRouter();
  const { expire } = useSuperAdmin();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) return null;

  return (
    <StudentDetail
      studentId={id}
      onBack={() => router.push('/superadmin/students')}
      onOpenMock={(examId) => router.push(`/superadmin/students/${id}/mocks/${examId}`)}
      onUnauthorized={expire}
    />
  );
}
