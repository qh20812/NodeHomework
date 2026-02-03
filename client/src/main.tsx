import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css';
import App from './App.tsx';
import LoginPage from './pages/auth/login.tsx';
import RegisterPage from './pages/auth/register.tsx';
import { LoadingProvider } from './contexts/LoadingContext.tsx';
import Loading from './components/ui/loading.tsx';
import { useLoading } from './contexts/LoadingContext.tsx';

// eslint-disable-next-line react-refresh/only-export-components
function AppWithLoading() {
  const { isLoading } = useLoading()
  
  return (
    <>
      {isLoading && <Loading />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<App />} />
      </Routes>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <AppWithLoading />
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>,
)
