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
import MenuDashboard from './pages/admin/menu/index.tsx';
import MenuForm from './pages/admin/menu/form.tsx';
import ReviewIndex from './pages/admin/review/index.tsx';
import ReviewReply from './pages/admin/review/reply.tsx';
import UserIndex from './pages/admin/users/index.tsx';
import UserShow from './pages/admin/users/show.tsx';
import MenuPage from './pages/menu.tsx';

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
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/category" element={<CategoryDashboard />} />
        <Route path='/admin/category/create' element={<CategoryForm />} />
        <Route path='/admin/category/edit/:id' element={<CategoryForm />} />
        <Route path="/admin/menu" element={<MenuDashboard />} />
        <Route path='/admin/menu/create' element={<MenuForm />} />
        <Route path='/admin/menu/edit/:id' element={<MenuForm />} />
        <Route path="/admin/review" element={<ReviewIndex />} />
        <Route path='/admin/review/reply/:id' element={<ReviewReply />} />
        <Route path="/admin/users" element={<UserIndex />} />
        <Route path='/admin/users/:id' element={<UserShow />} />
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
