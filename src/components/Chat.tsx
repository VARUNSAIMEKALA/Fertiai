import { useState, useRef, useEffect } from 'react';
import { Send, Leaf, Trash2, Download, Upload, HelpCircle } from 'lucide-react';
import { generateChatResponse } from '../lib/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatProps {
  onNavigate: (page: string, data?: any) => void;
}

// Simple agricultural bot responses
const agriculturalBot = {
  getResponse(question: string): string {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Paddy/Rice related questions
    if (normalizedQuestion.includes('paddy') || normalizedQuestion.includes('rice')) {
      if (normalizedQuestion.includes('clay') || normalizedQuestion.includes('soil')) {
        return 'Yes! Clay soil is excellent for paddy cultivation. Clay retains water well, which is perfect for rice farming. Ensure proper drainage during non-flooding periods and add organic matter to improve soil structure. 🌾';
      }
      if (normalizedQuestion.includes('water')) {
        return 'Rice needs 1200-1500mm of water during its growing season. Maintain 2-5cm standing water in fields during vegetative and reproductive stages. Drain fields 2 weeks before harvest. 💧';
      }
      return 'Rice grows best in clay or loamy soil with good water retention. It needs consistent flooding during growth stages and proper drainage before harvest. 🌾';
    }
    
    // Wheat related questions
    if (normalizedQuestion.includes('wheat')) {
      return 'For wheat, use NPK fertilizer (120:60:40 kg/ha). Apply nitrogen in 3 splits: 50% at sowing, 25% at tillering, and 25% at grain filling stage. Add phosphorus and potash at sowing time. 🌾';
    }
    
    // Tomato related questions
    if (normalizedQuestion.includes('tomato')) {
      return 'Tomatoes thrive in well-drained loamy soil with pH 6.0-6.8. The soil should be rich in organic matter. Avoid waterlogged conditions as they can cause root rot. 🍅';
    }
    
    // Corn/Maize related questions
    if (normalizedQuestion.includes('corn') || normalizedQuestion.includes('maize')) {
      return 'Plant corn when soil temperature reaches 60°F (15°C). In most regions, this is late spring after the last frost. Corn needs warm weather and plenty of sunlight to grow well. 🌽';
    }
    
    // Organic fertilizer questions
    if (normalizedQuestion.includes('organic')) {
      return 'Organic fertilizers improve soil structure, increase water retention, provide slow-release nutrients, and enhance beneficial microbial activity. They also reduce chemical runoff and are environmentally friendly. 🌱';
    }
    
    // Pest control questions
    if (normalizedQuestion.includes('pest')) {
      return 'Use integrated pest management: crop rotation, beneficial insects, neem oil, and organic pesticides. Regular monitoring and early intervention are key to effective pest control. 🐛';
    }
    
    // Soil pH questions
    if (normalizedQuestion.includes('ph') || normalizedQuestion.includes('acid')) {
      return 'Most crops prefer pH 6.0-7.0. Acidic soils (pH<6) need lime application. Alkaline soils (pH>8) need sulfur or organic matter. Test soil pH annually for best results. 📊';
    }
    
    // Fertilizer general questions
    if (normalizedQuestion.includes('fertilizer')) {
      return 'Choose fertilizers based on your crop and soil test results. NPK ratios vary by crop: vegetables need balanced NPK, cereals need more nitrogen, and fruits need more potassium. 🌱';
    }
    
    // Soil related questions
    if (normalizedQuestion.includes('soil')) {
      return 'Good soil should be well-drained, rich in organic matter, and have proper pH. Test your soil annually and add compost to improve structure and fertility. 🌱';
    }
    
    // Water related questions
    if (normalizedQuestion.includes('water')) {
      return 'Water requirements vary by crop. Most vegetables need 1-2 inches per week. Water deeply but less frequently to encourage deep root growth. 💧';
    }
    
    // Crop rotation questions
    if (normalizedQuestion.includes('rotation') || normalizedQuestion.includes('rotate')) {
      return 'Crop rotation prevents soil depletion and pest buildup. Rotate between legumes (beans), cereals (wheat), and root crops (potatoes). Follow nitrogen-fixing crops with heavy feeders. 🔄';
    }
    
    // Seed questions
    if (normalizedQuestion.includes('seed')) {
      return 'Use certified seeds for better yield. Treat seeds with fungicide before sowing. Check germination rate by testing 100 seeds - aim for 80%+ germination. Store seeds in cool, dry places. 🌱';
    }
    
    // Irrigation questions
    if (normalizedQuestion.includes('irrigation') || normalizedQuestion.includes('drip')) {
      return 'Drip irrigation saves 30-50% water and reduces disease. Install emitters near plant roots. Water early morning to reduce evaporation. Check soil moisture at 6-inch depth. 💧';
    }
    
    // Compost questions
    if (normalizedQuestion.includes('compost')) {
      return 'Good compost needs 3:1 carbon to nitrogen ratio. Mix dry leaves (carbon) with kitchen scraps (nitrogen). Turn weekly, keep moist. Ready in 3-6 months when dark and crumbly. 🍂';
    }
    
    // Disease questions
    if (normalizedQuestion.includes('disease') || normalizedQuestion.includes('fungus')) {
      return 'Prevent plant diseases with proper spacing for air circulation. Remove infected plants immediately. Use copper-based fungicides for organic control. Avoid overhead watering. 🦠';
    }
    
    // Harvest questions
    if (normalizedQuestion.includes('harvest') || normalizedQuestion.includes('when to pick')) {
      return 'Harvest vegetables when mature but tender. Pick fruits when color develops but still firm. Harvest grains when moisture content is 14-20%. Early morning harvest retains freshness. 🌾';
    }
    
    // Mulching questions
    if (normalizedQuestion.includes('mulch')) {
      return 'Mulch conserves moisture, suppresses weeds, and regulates soil temperature. Use organic mulch like straw or leaves. Apply 2-4 inches thick, keep away from plant stems. 🍃';
    }
    
    // Greenhouse questions
    if (normalizedQuestion.includes('greenhouse') || normalizedQuestion.includes('polyhouse')) {
      return 'Greenhouses extend growing seasons and protect from weather. Maintain 60-70°F temperature and 50-70% humidity. Ensure proper ventilation to prevent fungal diseases. 🏠';
    }
    
    // Nitrogen questions
    if (normalizedQuestion.includes('nitrogen') || normalizedQuestion.includes('yellowing')) {
      return 'Nitrogen deficiency causes yellowing leaves starting from bottom. Apply urea (46% N) or use organic sources like compost. Split nitrogen application for better uptake. 🍃';
    }
    
    return "I can help with farming questions about: crops (paddy, wheat, tomatoes, corn), fertilizers, soil, pest control, irrigation, composting, diseases, harvesting, mulching, greenhouses, and more! 🌾";
  }
};

export function Chat({ onNavigate }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! 🌾 I'm Ferti-AI, your agricultural assistant. Ask me about: crop rotation, seeds, irrigation, composting, plant diseases, harvesting, mulching, greenhouses, or any farming topic!",
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

  const handleChatHistoryClick = (chat: any) => {
    setFormData({
      cropName: chat.crop,
      area: chat.area.split(' ')[0],
      weatherConditions: 'Sunny',
      soilType: 'Loamy',
      growthStage: 'Vegetative',
    });
    const historyMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I've loaded your previous ${chat.crop} plan. You can modify the details in the form or generate a new plan! 🌱`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, historyMessage]);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    const userInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Try API first, fallback to simple bot
      let aiResponse;
      try {
        aiResponse = await generateChatResponse(userInput, formData);
      } catch (apiError) {
        // Use simple bot when API fails
        aiResponse = agriculturalBot.getResponse(userInput);
      }
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, responseMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: agriculturalBot.getResponse(userInput),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGeneratePlan = async () => {
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
    const successMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Perfect! I've analyzed your ${formData.cropName} in ${formData.soilType} soil. Generating your customized fertilizer plan now... 🌿`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, successMessage]);
    setIsTyping(false);

    setTimeout(() => {
      onNavigate('results', formData);
    }, 1500);
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
                  onClick={() => handleChatHistoryClick(chat)}
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
                  className="w-full px-4 py-3 bg-[#F6F3E7] border border-[#0C3C01]/20 rounded-xl focus:outline-none focus:border-[#0C3C01] hover:bg-[#EAE7E0] hover:border-[#0C3C01] transition-all text-[#0C3C01] [&>option]:bg-[#F6F3E7] [&>option]:text-[#0C3C01] [&>option:hover]:bg-[#EAE7E0] [&>option:hover]:text-[#0C3C01] [&>option]:transition-all"
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
                  className="w-full px-4 py-3 bg-[#F6F3E7] border border-[#0C3C01]/20 rounded-xl focus:outline-none focus:border-[#0C3C01] hover:bg-[#EAE7E0] hover:border-[#0C3C01] transition-all text-[#0C3C01] [&>option]:bg-[#F6F3E7] [&>option]:text-[#0C3C01] [&>option:hover]:bg-[#EAE7E0] [&>option:hover]:text-[#0C3C01] [&>option]:transition-all"
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