import { HashRouter, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CreateCommunityPage from './pages/CreateCommunityPage'
import CommunityPage from './pages/CommunityPage'
import CommunitiesPage from './pages/CommunitiesPage'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import UserProfilePage from './features/profiles/UserProfilePage'
import EditProfilePage from './features/profiles/EditProfilePage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/communities/:slug" element={<CommunityPage />} />
          <Route path="/users/:username" element={<UserProfilePage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-community" element={<CreateCommunityPage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
