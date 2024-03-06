import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Layout } from './layout/layout';
import { ReceiptPage } from './pages/receipts/[receiptId]';
import { ReceiptsPage } from './pages/receipts';
import { UploadPage } from './pages/upload';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<div>Login</div>} />
        <Route path="signup" element={<div>Signup</div>} />
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
