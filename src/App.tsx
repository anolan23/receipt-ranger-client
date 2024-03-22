import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Layout } from './layout/layout';
import { ReceiptPage } from './pages/receipts/[receiptId]';
import { ReceiptsPage } from './pages/receipts';
import { UploadPage } from './pages/upload';
import { SignupPage } from './pages/signup';
import { LoginPage } from './pages/login';
import { ConfirmPage } from './pages/confirm';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="confirm" element={<ConfirmPage />} />
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="receipts" element={<ReceiptsPage />} />
          <Route path="receipts/:receiptId" element={<ReceiptPage />} />
          <Route path="upload" element={<UploadPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
