import { Route, Routes } from 'react-router-dom';
import { ProtectedLayout } from './layout/protected-layout';
import { ConfirmPage } from './pages/confirm';
import { Dashboard } from './pages/dashboard';
import { LoginPage } from './pages/login';
import { ReceiptsPage } from './pages/receipts';
import { ReceiptPage } from './pages/receipts/[receiptId]';
import { SignupPage } from './pages/signup';
import { UploadPage } from './pages/upload';
// import { SettingsPage } from './pages/settings';
// import { AppearanceSettings } from './pages/settings/appearance';
// import { ProfileSettings } from './pages/settings/profile-settings';
// import { GoalsSettings } from './pages/settings/goals';
// import { SubscriptionSettings } from './pages/settings/subscription';
import { MembershipPage } from './pages/membership';
import { DashboardLayout } from './layout/dashboard-layout';
import { ReceiptsTestPage } from './pages/dashboard-test/receipts';
import { ScannerPage } from './pages/scanner';
import { DashboardTestPage } from './pages/dashboard-test';
import { SettingsPage } from './pages/dashboard-test/settings';
import { ProfileSettings } from './pages/dashboard-test/settings/profile-settings';
import { GoalsSettings } from './pages/dashboard-test/settings/goals';
import { SubscriptionSettings } from './pages/dashboard-test/settings/subscription';
import { AppearanceSettings } from './pages/dashboard-test/settings/appearance';
import SmartBreadcrumb from './components/smart-breadcrumb';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="confirm" element={<ConfirmPage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route path="dashboard-test" handle={{ crumb: () => 'Dashboard' }}>
          <Route index element={<DashboardTestPage />} />
          <Route path="receipts" element={<ReceiptsTestPage />} />
          <Route path="scanner" element={<ScannerPage />} />
          <Route path="settings" element={<SettingsPage />}>
            <Route index element={<ProfileSettings />} />
            <Route path="goals" element={<GoalsSettings />} />
            <Route path="subscription" element={<SubscriptionSettings />} />
            <Route path="appearance" element={<AppearanceSettings />} />
          </Route>
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="receipts" element={<ReceiptsPage />} />
          <Route path="receipts/:receiptId" element={<ReceiptPage />} />
          {/* <Route path="settings" element={<SettingsPage />}>
            <Route index element={<ProfileSettings />} />
            <Route path="goals" element={<GoalsSettings />} />
            <Route path="subscription" element={<SubscriptionSettings />} />
            <Route path="appearance" element={<AppearanceSettings />} />
          </Route> */}
          <Route path="upload" element={<UploadPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
