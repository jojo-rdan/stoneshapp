import { Outlet, useLocation } from 'react-router-dom';
import { getScreenMeta } from '@/app/screenMeta';
import { SidebarNav } from '@/components/navigation/SidebarNav';
import { Badge } from '@/components/ui/Badge';

export function MainLayout() {
  const location = useLocation();
  const currentScreen = getScreenMeta(location.pathname);

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="brand-panel">
          <span className="brand-panel__kicker">Desktop companion app</span>
          <h1>Stoneshapp</h1>
          <p>Shell base del MVP para conectar preparación, contratos, historial y módulos futuros.</p>
        </div>
        <SidebarNav />
      </aside>

      <div className="app-shell__content">
        <header className="shell-header">
          <div>
            <span className="shell-header__eyebrow">Navegacion principal</span>
            <h2>{currentScreen.title}</h2>
            <p>{currentScreen.description}</p>
          </div>
          <Badge tone="neutral">MVP frontend</Badge>
        </header>

        <main className="app-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
