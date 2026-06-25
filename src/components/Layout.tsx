import { Outlet, Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-secondary transition-colors">
            <Wrench className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight">Top Montadores</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/cadastro-montador">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                Sou Montador
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-primary text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-white/90" />
            <span className="font-bold text-xl tracking-tight">TopMontador</span>
          </div>
          <p className="text-white/70 text-sm">
            &copy; {new Date().getFullYear()} TopMontador. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
