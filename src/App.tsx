import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Chat } from './components/Chat';
import { Results } from './components/Results';
import { Login } from './components/Login';
import { Account } from './components/Account';

interface User {
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [resultsData, setResultsData] = useState(null);
  const [user, setUser] = useState<User | null>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    if (data) {
      setResultsData(data);
    }
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'chat':
        return <Chat onNavigate={handleNavigate} />;
      case 'results':
        return <Results formData={resultsData} />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'account':
        return user ? <Account user={user} onSignOut={handleSignOut} /> : <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F2ED]">
      {currentPage !== 'login' && (
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} user={user} />
      )}
      {renderPage()}
    </div>
  );
}

export default App;