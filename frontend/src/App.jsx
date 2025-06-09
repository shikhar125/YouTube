import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import HomeScreen from './screens/HomeScreen';
import VideoScreen from './screens/VideoScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChannelScreen from './screens/ChannelScreen';
import CreateChannelScreen from './screens/CreateChannelScreen';
import CreateVideoScreen from './screens/CreateVideoScreen';
import { useState } from 'react';


function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'ml-56 md:ml-64' : 'ml-0'} transition-all duration-300 p-4`}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/video/:id" element={<VideoScreen />} />
            
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/channel/:id" element={<ChannelScreen />} />
            {user && (
              <>
                <Route path="/create-channel" element={<CreateChannelScreen />} />
                <Route path="/upload-video" element={<CreateVideoScreen />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;