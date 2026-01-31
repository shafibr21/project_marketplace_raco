'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) return <div className="flex h-screen items-center justify-center bg-background text-foreground">Loading...</div>;

    // Solver gets Dark Mode
    const isSolver = user.role === 'solver';

    // Apply dark class to wrapper if solver
    return (
        <div className="min-h-screen flex bg-slate-50 text-slate-900">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
