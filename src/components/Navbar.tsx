import { useState } from 'react';
import { Wheat, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

export function Navbar({ currentPage, onNavigate, user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Chat', id: 'chat' },
  ];

  return (
    <nav className="bg-[#F1F2ED] border-b border-[#0C3C01]/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 group"
          >
            <Wheat className="h-8 w-8 text-[#0C3C01]" />
            <span className="text-[#0C3C01] transition-colors">
              Ferti-AI 🌾
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-[#0C3C01] hover:text-[#355E2D] transition-all relative group ${
                  currentPage === item.id ? 'font-medium' : ''
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#8B7765] transform origin-left transition-transform ${
                    currentPage === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            ))}
            {user ? (
              <button
                onClick={() => onNavigate('account')}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#0C3C01] to-[#355E2D] text-white hover:shadow-lg transition-all hover:scale-105"
                title={`Account - ${user.name}`}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-lg">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </button>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-6 py-2 bg-[#0C3C01] text-white rounded-full hover:bg-[#355E2D] transition-all hover:shadow-lg"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#0C3C01]"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#F1F2ED] border-t border-[#0C3C01]/10">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-[#0C3C01] hover:bg-[#EAE7E0] rounded-lg transition-colors ${
                  currentPage === item.id ? 'bg-[#EAE7E0]' : ''
                }`}
              >
                {item.name}
              </button>
            ))}
            {user ? (
              <button
                onClick={() => {
                  onNavigate('account');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-[#0C3C01] hover:bg-[#EAE7E0] rounded-lg transition-colors"
              >
                Account
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 bg-[#0C3C01] text-white rounded-lg hover:bg-[#355E2D] transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}