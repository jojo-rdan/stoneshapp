import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { appRoutes } from '@/app/routes';
import { ContractDetailPage } from '@/pages/ContractDetailPage';
import { ContractsPage } from '@/pages/ContractsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OverlaySettingsPage } from '@/pages/OverlaySettingsPage';
import { PrepareRunPage } from '@/pages/PrepareRunPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SettingsPage } from '@/pages/SettingsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path={appRoutes.dashboard}
          element={<DashboardPage />}
        />
        <Route
          path={appRoutes.prepareRun}
          element={<PrepareRunPage />}
        />
        <Route
          path={appRoutes.contracts}
          element={<ContractsPage />}
        />
        <Route
          path={appRoutes.contractDetail}
          element={<ContractDetailPage />}
        />
        <Route
          path={appRoutes.history}
          element={<HistoryPage />}
        />
        <Route
          path={appRoutes.profile}
          element={<ProfilePage />}
        />
        <Route
          path={appRoutes.overlaySettings}
          element={<OverlaySettingsPage />}
        />
        <Route
          path={appRoutes.settings}
          element={<SettingsPage />}
        />
        <Route
          path="/404"
          element={<NotFoundPage />}
        />
        <Route
          path="*"
          element={<Navigate to="/404" replace />}
        />
      </Route>
    </Routes>
  );
}
