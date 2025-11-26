import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  console.warn('Gemini API key not found')
}

let genAI: GoogleGenerativeAI | null = null
let model: any = null

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey)
  model = genAI.getGenerativeModel({ model: 'models/gemini-pro' })
}

export async function generateFertilizerRecommendation(formData: any) {
  if (!apiKey || !model) {
    return 'Based on your soil type and crop requirements, we recommend a balanced NPK approach with proper timing for optimal growth.';
  }
  
  try {
    const prompt = `As an agricultural AI expert, provide fertilizer recommendations for:
Crop: ${formData.cropName}
Area: ${formData.area} acres
Soil Type: ${formData.soilType}
Weather: ${formData.weatherConditions}
Growth Stage: ${formData.growthStage}

Provide specific NPK values, application timing, and brief explanation.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Based on your soil type and crop requirements, we recommend a balanced NPK approach with proper timing for optimal growth.';
  }
}

// Simple agricultural bot for fallback
function getSimpleBotResponse(question: string): string {
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
  
  return "I can help with questions about crops like paddy, wheat, tomatoes, corn, fertilizers, soil types, pest control, and farming practices. What would you like to know? 🌾";
}

export async function generateChatResponse(message: string, formData?: any) {
  if (!apiKey || !model) {
    return getSimpleBotResponse(message);
  }
  
  try {
    const context = formData && formData.cropName ? `Context: Crop: ${formData.cropName}, Soil: ${formData.soilType}` : '';
    const prompt = `${context}
User: ${message}
As Ferti-AI, a friendly agricultural assistant, respond helpfully with practical farming advice. Keep responses concise.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return getSimpleBotResponse(message);
  }
}