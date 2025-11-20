import { Routes, Route } from 'react-router-dom'
import { SearchPage } from './pages/SearchPage'
import { ResultsPage } from './pages/ResultsPage'
import BookingPage from './pages/BookingPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200">
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </div>
  )
}

export default App