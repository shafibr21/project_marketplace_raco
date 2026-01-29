import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/FadeIn';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
            <FadeIn>
                <div className="text-center space-y-6">
                    <h1 className="text-6xl font-bold text-slate-900 tracking-tight">Marketplace</h1>
                    <p className="text-xl text-slate-500">
                        Connect. Solve. Deliver. A premium workflow system.
                    </p>
                    <div className="flex gap-4 justify-center pt-4">
                        <Link href="/login">
                            <Button size="lg" className="w-40">Login</Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="outline" size="lg" className="w-40">Register</Button>
                        </Link>
                    </div>
                </div>
            </FadeIn>
        </main>
    );
}
