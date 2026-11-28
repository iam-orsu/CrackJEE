'use client';

import { useParams, useRouter } from 'next/navigation';
import { MockDetail } from '../../../../details';
import { useSuperAdmin } from '@/components/superadmin/superadmin-context';

export default function SuperAdminMockDetailPage() {
  const params = useParams<{ id: string | string[]; examId: string | string[] }>();
  const router = useRouter();
  const { expire } = useSuperAdmin();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const examId = Array.isArray(params.examId) ? params.examId[0] : params.examId;
  if (!examId) return null;

  return (
    <MockDetail
      examId={examId}
      onBack={() => router.push(id ? `/superadmin/students/${id}` : '/superadmin/students')}
      onUnauthorized={expire}
    />
  );
}
