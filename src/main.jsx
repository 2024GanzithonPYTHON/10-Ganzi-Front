import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Footer from './footer';

import Header from './Components/1. Auth/AptHeader';
import Login from './Components/1. Auth/LoginScreen';
import Join from './Components/1. Auth/JoinScreen';

import HomeScreen from './Components/2. Main/HomeScreen';
import Album from './Components/2. Main/Album';
import MyActivities from './Components/2. Main/MyActivities'
import Write from './Components/2. Main/Write';
import MyPage from './Components/2. Main/MyPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/home" element={<><HomeScreen /><Footer /></>} />
        <Route path="/album" element={<><Album /><Footer /></>} />
        <Route path="/myactivities" element={<><MyActivities /><Footer /></>} />
        <Route path="/mypage" element={<><MyPage /><Footer /></>} />
        <Route path="/write" element={<Write />} />
      </Routes>
    </Router>
  </StrictMode>,
)