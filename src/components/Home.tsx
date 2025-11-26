import { Leaf, Droplets, Users, ArrowRight, Sprout, FlaskConical, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: FlaskConical,
      title: 'Precision AI',
      description: 'Advanced machine learning analyzes your unique soil composition and crop needs',
      color: '#0C3C01',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Sustainable fertilizer recommendations that protect our planet',
      color: '#355E2D',
    },
    {
      icon: Users,
      title: 'Farmer-Centric',
      description: 'Designed by farmers, for farmers. Simple, practical, and effective',
      color: '#6B7C59',
    },
  ];

  const steps = [
    {
      icon: Sprout,
      title: 'Input crop & soil',
      description: 'Share details about your crop type, soil condition, and growing stage',
    },
    {
      icon: FlaskConical,
      title: 'AI analyzes',
      description: 'Our intelligent system processes your data with precision algorithms',
    },
    {
      icon: TrendingUp,
      title: 'Get plan',
      description: 'Receive a customized fertilizer plan optimized for your farm',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Floating Leaves Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <Leaf className="absolute top-20 left-[10%] w-8 h-8 text-[#355E2D] opacity-20 floating" />
        <Leaf className="absolute top-40 right-[15%] w-6 h-6 text-[#6B7C59] opacity-15 floating-delayed" />
        <Leaf className="absolute bottom-40 left-[20%] w-10 h-10 text-[#0C3C01] opacity-10 drift" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 gradient-beige parchment-texture opacity-80" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-fadeInUp">
              <div className="inline-block px-4 py-2 bg-[#EAE7E0] rounded-full text-[#0C3C01] border border-[#0C3C01]/20">
                🌾 Smart Agriculture Technology
              </div>
              
              <h1 className="text-[#0C3C01]">
                Ferti-AI 🌾
              </h1>
              <h2 className="text-[#355E2D]">
                Smart Fertilizer Recommender
              </h2>
              
              <p className="text-[#2D3E1F] max-w-xl">
                AI-driven guidance for crops, soil, and fertilizer management. 
                Let's grow smarter, together 🌾
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => onNavigate('chat')}
                  className="px-8 py-4 gradient-moss text-white rounded-full hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
                >
                  Start Chat
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1724531281596-cfae90d5a082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZhcm1sYW5kJTIwYWVyaWFsfGVufDF8fHx8MTc2NDEzMDAzMXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Green farmland aerial view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#355E2D] rounded-full opacity-20 blur-3xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#0C3C01] rounded-full opacity-20 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Ferti-AI Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F6F3E7] parchment-texture">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#0C3C01] mb-4">
              Why Ferti-AI?
            </h2>
            <p className="text-[#2D3E1F] max-w-2xl mx-auto">
              Your soil is unique — Ferti-AI understands it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-wood rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2 group parchment-texture"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                </div>
                <h3 className="text-[#0C3C01] mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#2D3E1F]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F1F2ED]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[#0C3C01] mb-4">
              How It Works
            </h2>
            <p className="text-[#2D3E1F]">
              Simple, smart, and effective in three steps
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#8B7765] via-[#6B7C59] to-[#0C3C01] opacity-30 transform -translate-y-1/2" />

            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 gradient-moss rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <step.icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#8B7765] text-white rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-[#0C3C01] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#2D3E1F]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('chat')}
              className="px-10 py-4 gradient-moss text-white rounded-full hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0C3C01] to-[#355E2D] relative overflow-hidden">
        <div className="absolute inset-0 soil-texture opacity-10" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Droplets className="w-16 h-16 text-white/40 mx-auto mb-6" />
          <h2 className="text-white mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who trust Ferti-AI for smarter, more sustainable farming practices.
          </p>
          <button
            onClick={() => onNavigate('chat')}
            className="px-10 py-4 bg-white text-[#0C3C01] rounded-full hover:bg-[#F6F3E7] transition-all hover:scale-105"
          >
            Start Your Free Analysis
          </button>
        </div>
      </section>
    </div>
  );
}