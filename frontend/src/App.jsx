import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      {/* Outras rotas, como a do Dashboard, virão aqui */}
    </Routes>
  )
}

export default App