'use client';

import { useRouter } from 'next/navigation';

export default function Perfil() {
  const router = useRouter();

  function deslogar() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    router.push('/');
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Perfil</h1>
      <button onClick={deslogar} style={{ marginTop: 20, padding: '12px 24px', cursor: 'pointer' }}>
        Deslogar
      </button>
      <h1 style={{ color: 'red', fontSize: 40, marginTop: 50}}>WIP - WORK IN PROGRESS!</h1>
    </div>
  );
}