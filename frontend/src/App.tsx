import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CreateCommunityPage from './pages/CreateCommunityPage'
import CommunityPage from './pages/CommunityPage'
import CommunitiesPage from './pages/CommunitiesPage'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/communities/:slug" element={<CommunityPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-community" element={<CreateCommunityPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
