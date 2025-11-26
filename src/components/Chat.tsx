import { useState, useRef, useEffect } from 'react';
import { Send, Leaf, Trash2, Download, Upload } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatProps {
  onNavigate: (page: string, data?: any) => void;
}

export function Chat({ onNavigate }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! 🌾 I'm Ferti-AI, your intelligent farming assistant. I'll help you create the perfect fertilizer plan for your crops. Please fill out the form on the right to get started, or tell me about your farming needs!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    area: '',
    weatherConditions: '',
    soilType: '',
    growthStage: '',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "That's great information! To provide you with the most accurate fertilizer recommendation, could you please fill out the form with details about your crop, soil pH, and growth stage? This will help me analyze your specific needs. 🌱",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleGeneratePlan = () => {
    if (!formData.cropName || !formData.soilType) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Please fill in at least the crop name and soil type to generate a plan. These are essential for accurate recommendations! 🌾",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    setIsTyping(true);

    setTimeout(() => {
      const successMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Perfect! I've analyzed your ${formData.cropName} in ${formData.soilType} soil. Generating your customized fertilizer plan now... 🌿`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
      setIsTyping(false);

      // Navigate to results page with form data
      setTimeout(() => {
        onNavigate('results', formData);
      }, 1500);
    }, 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hello! 🌾 I'm Ferti-AI, your intelligent farming assistant. I'll help you create the perfect fertilizer plan for your crops. Please fill out the form on the right to get started, or tell me about your farming needs!",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F1F2ED] parchment-texture py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[280px_1fr_1fr] gap-8">
          {/* Chat History Panel */}
          <div className="hidden lg:block space-y-4">
            <h3 className="text-[#0C3C01]">Previous Chats</h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-[#0C3C01]/10 space-y-2 max-h-[600px] overflow-y-auto">
              {/* Mock chat history */}
              {[
                { crop: 'Wheat', area: '10 acres', date: 'Nov 25, 2:30 PM' },
                { crop: 'Rice', area: '5 acres', date: 'Nov 24, 11:15 AM' },
                { crop: 'Corn', area: '8 acres', date: 'Nov 23, 4:45 PM' },
              ].map((chat, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 rounded-xl hover:bg-[#EAE7E0] transition-colors border border-transparent hover:border-[#0C3C01]/20 group"
                >
                  <p className="text-[#0C3C01] font-medium">{chat.crop}</p>
                  <p className="text-sm text-[#6B7C59]">{chat.area}</p>
                  <p className="text-xs text-[#8B7765] mt-1">{chat.date}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[#0C3C01] flex items-center gap-2">
                <Leaf className="w-8 h-8" />
                Chat with Ferti-AI
              </h2>
              <button
                onClick={handleClearChat}
                className="flex items-center gap-2 px-4 py-2 text-[#8B7765] hover:text-[#0C3C01] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>

            {/* Chat Messages */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 h-[500px] overflow-y-auto border border-[#0C3C01]/10">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-[#EAE7E0] border-2 border-[#0C3C01]/20'
                          : 'bg-white shadow-md relative overflow-hidden'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <Leaf className="absolute top-2 right-2 w-6 h-6 text-[#0C3C01] opacity-10" />
                      )}
                      <p className="text-[#0C3C01] relative z-10">{message.content}</p>
                      <span className="text-xs text-[#6B7C59] mt-2 block">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white shadow-md rounded-2xl p-4 max-w-[80%]">
                      <p className="text-[#0C3C01]">Ferti-AI is analyzing your soil 🌾...</p>
                      <div className="flex gap-1 mt-2">
                        <div className="w-2 h-2 bg-[#0C3C01] rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-[#355E2D] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-[#6B7C59] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-[#0C3C01]/10">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about fertilizers, soil health, or crop needs..."
                  className="flex-1 px-4 py-3 bg-[#F6F3E7] border border-[#0C3C01]/20 rounded-full focus:outline-none focus:border-[#0C3C01] transition-colors text-[#0C3C01]"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 gradient-moss text-white rounded-full hover:shadow-lg transition-all hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Smart Input Form */}
          <div className="space-y-4">
            <h2 className="text-[#0C3C01]">
              Farm Details
            </h2>

            <div className="card-wood rounded-2xl p-8 shadow-lg space-y-6 parchment-texture">
              <div className="space-y-2">
                <label className="block text-[#0C3C01]">
                  Crop Name *
                </label>
                <input
                  type="text"
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  placeholder="e.g., Wheat, Rice, Corn"
                  className="w-full px-4 py-3 bg-[#F6F3E7] border border-[#0C3C01]/20 rounded-xl focus:outline-none focus:border-[#0C3C01] transition-colors text-[#0C3C01]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#0C3C01]">
                  Area (in acres)
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g., 10"
                  className="w-full px-4 py-3 bg-[#F6F3E7] border border-[#0C3C01]/20 rounded-xl focus:outline-none focus:border-[#0C3C01] transition-colors text-[#0C3C01]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#0C3C01]">
                  Weather Conditions
                </label>
                <input
                  type="text"
                  value={formData.weatherConditions}
                  onChange={(e) => setFormData({ ...formData, weatherConditions: e.target.value })}
                  placeholder="e.g., Sunny, Rainy"
                  className="w-full px-4 py-3 bg-[#F6F3E7] border border-[#0C3C01]/20 rounded-xl focus:outline-none focus:border-[#0C3C01] transition-colors text-[#0C3C01]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#0C3C01]">
                  Soil Type *
                </label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F6F3E7] border border-[#0C3C01]/20 rounded-xl focus:outline-none focus:border-[#0C3C01] transition-colors text-[#0C3C01]"
                >
                  <option value="">Select soil type</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Silty">Silty</option>
                  <option value="Peaty">Peaty</option>
                  <option value="Chalky">Chalky</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[#0C3C01]">
                  Growth Stage
                </label>
                <select
                  value={formData.growthStage}
                  onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F6F3E7] border border-[#0C3C01]/20 rounded-xl focus:outline-none focus:border-[#0C3C01] transition-colors text-[#0C3C01]"
                >
                  <option value="">Select growth stage</option>
                  <option value="Seedling">Seedling</option>
                  <option value="Vegetative">Vegetative</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Fruiting">Fruiting</option>
                  <option value="Maturity">Maturity</option>
                </select>
              </div>

              <button
                onClick={handleGeneratePlan}
                className="w-full py-4 gradient-moss text-white rounded-xl hover:shadow-xl transition-all hover:scale-105"
              >
                Generate Fertilizer Plan 🌾
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}