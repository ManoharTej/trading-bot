
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import Settings from './pages/Settings';
import { OpenOrders, OrderHistory, Logs } from './pages/Placeholders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="order" element={<NewOrder />} />
          <Route path="open-orders" element={<OpenOrders />} />
          <Route path="history" element={<OrderHistory />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
