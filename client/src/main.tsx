import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css';
import App from './App.tsx';
import LoginPage from './pages/auth/login.tsx';
import AdminDashboard from './pages/admin/index.tsx';
import RegisterPage from './pages/auth/register.tsx';
import { LoadingProvider } from './contexts/LoadingContext.tsx';
import { AlertProvider } from './contexts/AlertContext.tsx';
import Loading from './components/ui/loading.tsx';
import { useLoading } from './contexts/LoadingContext.tsx';
import CategoryDashboard from './pages/admin/category/index.tsx';
import CategoryForm from './pages/admin/category/form.tsx';

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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/category" element={<CategoryDashboard />} />
        <Route path='/admin/category/create' element={<CategoryForm />} />
        <Route path='/admin/category/edit/:id' element={<CategoryForm />} />
      </Routes>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <AlertProvider>
          <AppWithLoading />
        </AlertProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>,
)
