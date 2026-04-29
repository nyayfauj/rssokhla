import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-white mb-2">404</h1>
        <p className="text-zinc-400 mb-6">This page doesn&apos;t exist or you don&apos;t have access.</p>
        <Link href="/dashboard" className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">Go to Dashboard</Link>
      </div>
    </div>
  );
}
