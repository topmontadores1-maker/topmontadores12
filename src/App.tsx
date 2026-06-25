import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Pages
import HomePage from '@/pages/HomePage';
import CadastroMontadorPage from '@/pages/CadastroMontadorPage';
import EstadoPage from '@/pages/EstadoPage';
import CidadePage from '@/pages/CidadePage';
import ServicoPage from '@/pages/ServicoPage';
import ServicoCidadePage from '@/pages/ServicoCidadePage';
import MontadorPage from '@/pages/MontadorPage';
import AdminPage from '@/pages/AdminPage';
import Layout from '@/components/Layout';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cadastro-montador" element={<CadastroMontadorPage />} />
          <Route path="estado/:uf" element={<EstadoPage />} />
          <Route path="estado/:uf/:cidade" element={<CidadePage />} />
          <Route path="servico/:slug" element={<ServicoPage />} />
          <Route path="servico/:slug/:uf/:cidade" element={<ServicoCidadePage />} />
          <Route path="montador/:slug" element={<MontadorPage />} />
          <Route path="admin/*" element={<AdminPage />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}
