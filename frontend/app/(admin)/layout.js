'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) {
      router.replace('/login');
      return;
    }

    const user = JSON.parse(raw);
    if (!user.is_staff) {
      router.replace('/');
    }
  }, []);

  return <>{children}</>;
}