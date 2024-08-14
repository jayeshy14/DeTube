import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Video from './pages/Video';
import Dashboard from './pages/Dashboard';
import { YoutubeProvider } from './context/YoutubeContext';
import Upload from './pages/Upload';

function App() {
  return (
    <YoutubeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 text-gray-900">
          <Header />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/video/:id" element={<Video/>} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path= "/upload" element={<Upload></Upload>}/>
            </Routes>
          </main>
        </div>
      </Router>
    </YoutubeProvider>
  );
}

export default App;

