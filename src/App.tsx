import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './layout/protected-route';
import { ConfirmPage } from './pages/confirm';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';

import { MembershipPage } from './pages/membership';
import { DashboardPage } from './pages/dashboard';
import { AnalyticsPage } from './pages/dashboard/analytics';
import { ReceiptsPage } from './pages/dashboard/receipts';
import { ScannerPage } from './pages/scanner';
import { SettingsPage } from './pages/dashboard/settings';
import { ProfileSettings } from './pages/dashboard/settings/profile-settings';
import { GoalsSettings } from './pages/dashboard/settings/goals';
import { SubscriptionSettings } from './pages/dashboard/settings/subscription';
import { AppearanceSettings } from './pages/dashboard/settings/appearance';
import { ReceiptPage } from './pages/dashboard/receipts/[receiptId]';
import { CategoryPage } from './pages/dashboard/categories/[categoryId]';
import { NotFoundPage } from './layout/not-found-page';
import { DashboardLayout } from './layout/dashboard-layout';
import { ItemsPage } from './pages/dashboard/items';
import { ReceiptInsightsPage } from './pages/dashboard/analytics/receipt-insights';
import { ItemInsightsPage } from './pages/dashboard/analytics/item-insights';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="confirm" element={<ConfirmPage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard">
            <Route index element={<DashboardPage />} />
            <Route path="analytics" element={<AnalyticsPage />}>
              <Route index element={<ReceiptInsightsPage />} />
              <Route path="item-insights" element={<ItemInsightsPage />} />
            </Route>
            <Route path="categories" element={<div>Categories</div>} />
            <Route path="categories/:categoryId" element={<CategoryPage />} />
            <Route path="receipts" element={<ReceiptsPage />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="receipts/:receiptId" element={<ReceiptPage />} />
            <Route path="scanner" element={<ScannerPage />} />
            <Route path="settings" element={<SettingsPage />}>
              <Route index element={<ProfileSettings />} />
              <Route path="goals" element={<GoalsSettings />} />
              <Route path="subscription" element={<SubscriptionSettings />} />
              <Route path="appearance" element={<AppearanceSettings />} />
            </Route>
            <Route
              path="*"
              element={<DashboardLayout content={<NotFoundPage />} />}
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
