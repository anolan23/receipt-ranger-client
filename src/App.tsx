import { Route, Routes } from 'react-router-dom';
import { ProtectedLayout } from './layout/protected-layout';
import { ConfirmPage } from './pages/confirm';
import { Dashboard } from './pages/dashboard';
import { LoginPage } from './pages/login';
import { ReceiptsPage } from './pages/receipts';
import { ReceiptPage } from './pages/receipts/[receiptId]';
import { SignupPage } from './pages/signup';
import { UploadPage } from './pages/upload';
import { SettingsPage } from './pages/settings';
import { AppearanceSettings } from './pages/settings/appearance';
import { ProfileSettings } from './pages/settings/profile-settings';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="confirm" element={<ConfirmPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="receipts" element={<ReceiptsPage />} />
          <Route path="receipts/:receiptId" element={<ReceiptPage />} />
          <Route path="settings" element={<SettingsPage />}>
            <Route index element={<ProfileSettings />} />
            <Route path="organization" element={<div>organization</div>} />
            <Route path="subscription" element={<div>subscription</div>} />
            <Route path="appearance" element={<AppearanceSettings />} />
          </Route>
          <Route path="upload" element={<UploadPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
