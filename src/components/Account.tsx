import { User, Mail, Calendar, LogOut, Leaf, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AccountProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
  };
  onSignOut: () => void;
}

export function Account({ user, onSignOut }: AccountProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateName = async () => {
    if (!password) {
      alert('Password is required to update name');
      return;
    }
    
    setLoading(true);
    try {
      // First verify password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
      });
      if (signInError) throw signInError;
      
      // Then update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { full_name: newName }
      });
      if (error) throw error;
      
      alert('Name updated successfully!');
      setIsEditing(false);
      setPassword('');
    } catch (error: any) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[#0C3C01] mb-4">My Account</h1>
          <p className="text-[#6B7C59]">Manage your Ferti-AI profile</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-[#0C3C01]/10 relative overflow-hidden">
          {/* Decorative leaves */}
          <div className="absolute top-0 right-0 opacity-5">
            <Leaf className="w-64 h-64 text-[#0C3C01] transform rotate-45" />
          </div>

          <div className="relative">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0C3C01] to-[#355E2D] flex items-center justify-center text-white shadow-lg mb-4">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-5xl">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <h2 className="text-[#0C3C01] mb-2">{user.name}</h2>
              <p className="text-[#6B7C59]">Ferti-AI Member</p>
            </div>

            {/* Account Details */}
            <div className="space-y-6 mb-8">
              {/* Email */}
              <div className="bg-[#F6F3E7] rounded-xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#0C3C01]" />
                </div>
                <div>
                  <h3 className="text-[#0C3C01] mb-1">Email Address</h3>
                  <p className="text-[#6B7C59]">{user.email}</p>
                </div>
              </div>

              {/* Name */}
              <div className="bg-[#F6F3E7] rounded-xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-[#0C3C01]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[#0C3C01]">Full Name</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-[#6B7C59] hover:text-[#0C3C01] transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#0C3C01]/20 rounded-lg focus:outline-none focus:border-[#0C3C01] text-[#0C3C01]"
                      />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password to confirm"
                        className="w-full px-3 py-2 bg-white border border-[#0C3C01]/20 rounded-lg focus:outline-none focus:border-[#0C3C01] text-[#0C3C01]"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateName}
                          disabled={loading}
                          className="px-4 py-2 bg-[#0C3C01] text-white rounded-lg hover:bg-[#355E2D] transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Updating...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setNewName(user.name);
                            setPassword('');
                          }}
                          className="px-4 py-2 bg-[#8B7765] text-white rounded-lg hover:bg-[#6B7C59] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#6B7C59]">{user.name}</p>
                  )}
                </div>
              </div>

              {/* Account Created */}
              <div className="bg-[#F6F3E7] rounded-xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#0C3C01]" />
                </div>
                <div>
                  <h3 className="text-[#0C3C01] mb-1">Member Since</h3>
                  <p className="text-[#6B7C59]">{new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="w-full py-4 bg-[#0C3C01] text-white rounded-xl hover:bg-[#355E2D] transition-all hover:shadow-xl flex items-center justify-center gap-3 group"
            >
              <LogOut className="w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
