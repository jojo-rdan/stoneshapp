import { Link } from 'react-router-dom';
import { appRoutes } from '@/app/routes';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Página no encontrada');

  return (
    <div className="page-stack">
      <EmptyState
        title="Ruta no encontrada"
        description="La página solicitada no existe dentro del router actual."
      />
      <Link
        className="text-link"
        to={appRoutes.dashboard}
      >
        Ir al dashboard
      </Link>
    </div>
  );
}
