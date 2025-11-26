import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Chat } from './components/Chat';
import { Results } from './components/Results';
import { Login } from './components/Login';
import { Account } from './components/Account';
import { supabase } from './lib/supabase';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: session.user.user_metadata?.avatar_url,
          createdAt: session.user.created_at || new Date().toISOString()
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: session.user.user_metadata?.avatar_url,
          createdAt: session.user.created_at || new Date().toISOString()
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F2ED] flex items-center justify-center">
        <div className="text-[#0C3C01] text-xl">Loading Ferti-AI... 🌾</div>
      </div>
    );
  }

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