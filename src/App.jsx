import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import AccessDenied from './pages/AccessDenied'
import PrivateRoute from './pages/PrivateRoute'

import UserLogin from './user/UserLogin'
import UserRegister from './user/UserRegister'
import UserDashboard from './user/UserDashboard'

import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'


function App() {
  
  return (
    <div>
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/access-denied' element={ <AccessDenied /> } />
              <Route path="*" element={<h2>Page not found</h2>} />

              <Route path='/user/register' element={ <UserRegister /> } />
              <Route path='/user/login' element={ <UserLogin /> }  />
              <Route path='/user/dashboard' element={ <PrivateRoute allowedRole={"USER"} > <UserDashboard /> </PrivateRoute> } />

              <Route path='/admin/login' element={ <AdminLogin /> }  />
              <Route path='/admin/dashboard' element={ <PrivateRoute allowedRole={"ADMIN"} > <AdminDashboard /> </PrivateRoute> } />

          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
