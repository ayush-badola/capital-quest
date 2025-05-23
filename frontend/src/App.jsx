import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketContext, socket } from './contexts/SocketContext';
import JudgeUI from './components/JudgeUI';
import AdminPanel from './components/AdminPanel';
import ScoreBoard from './components/ScoreBoard';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './styles/main.css';



// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <RootLayout />,
//     future: { v7_relativeSplatPath: true }, // Add this
//     children: [
//       { path: '/judge', element: <JudgeUI /> },
//       { path: '/admin', element: <AdminPanel /> },
//       { index: true, element: <ScoreBoard /> }
//     ]
//   }
// ]);

const RootLayout = ({ children }) => {
  return (
    <div className="app-container">
      {children}
    </div>
  );
};


function App() {
  useEffect(() => {
    socket.connect();
    }, []);
  return (
    <SocketContext.Provider value={socket}>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/judge" element={<JudgeUI />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<ScoreBoard />} />
        </Routes>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;