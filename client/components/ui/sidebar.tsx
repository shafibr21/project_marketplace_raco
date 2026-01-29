'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Users,
    LogOut,
    Settings,
    ShieldAlert,
    PieChart,
    Wallet
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
        <Link href={href}>
            <Button
                variant="ghost"
                className={`w-full justify-start gap-3 mb-1 transition-all duration-200 ${isActive(href)
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
                    }`}
            >
                <Icon className="w-5 h-5" />
                {label}
            </Button>
        </Link>
    );

    return (
        <aside className="w-64 h-full flex flex-col border-r bg-card/50 backdrop-blur-xl fixed left-0 top-0 z-50">
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        M
                    </div>
                    Marketplace
                </h1>
                <p className="text-xs text-muted-foreground mt-2 capitalize font-medium flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-red-500' : user.role === 'buyer' ? 'bg-blue-500' : 'bg-green-500'}`} />
                    {user.role} Workspace
                </p>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground mb-3 px-4 uppercase tracking-wider">
                        Main Menu
                    </p>

                    {user.role === 'admin' && (
                        <>
                            <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
                            <NavItem href="/admin/users" icon={Users} label="User Management" />
                            <NavItem href="/admin/projects" icon={ShieldAlert} label="Projects" />
                        </>
                    )}

                    {user.role === 'buyer' && (
                        <>
                            <NavItem href="/buyer" icon={LayoutDashboard} label="Dashboard" />
                            <NavItem href="/buyer/projects" icon={Briefcase} label="My Projects" />
                            <NavItem href="/buyer/finance" icon={PieChart} label="Financials" />
                        </>
                    )}

                    {user.role === 'solver' && (
                        <>
                            <NavItem href="/solver" icon={LayoutDashboard} label="My Dashboard" />
                            <NavItem href="/solver/marketplace" icon={Briefcase} label="Browse Jobs" />
                            <NavItem href="/solver/earnings" icon={Wallet} label="Earnings" />
                        </>
                    )}
                </div>

            </nav>

            <div className="p-4 border-t bg-muted/20">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>
                <Button variant="destructive" className="w-full justify-start" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
            </div>
        </aside>
    );
}
