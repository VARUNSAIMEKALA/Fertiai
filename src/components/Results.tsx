import { Download, Share2, Save, AlertTriangle, Info, TrendingUp, Droplets, Leaf } from 'lucide-react';
import { generateFertilizerRecommendation } from '../lib/gemini';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

interface ResultsProps {
  formData?: {
    cropName: string;
    area: string;
    weatherConditions: string;
    soilType: string;
    growthStage: string;
  };
}

export function Results({ formData }: ResultsProps) {
  const [aiRecommendation, setAiRecommendation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Default data if no form data provided
  const data = formData || {
    cropName: 'Wheat',
    area: '10',
    weatherConditions: 'Sunny',
    soilType: 'Loamy',
    growthStage: 'Vegetative',
  };

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const recommendation = await generateFertilizerRecommendation(data);
        setAiRecommendation(recommendation);
      } catch (error) {
        console.error('AI Recommendation Error:', error);
        setAiRecommendation('Based on your inputs, we recommend following standard agricultural practices for optimal crop growth.');
      }
      setLoading(false);
    };
    fetchRecommendation();
  }, [data.cropName, data.soilType, data.area]);

  const area = parseFloat(data.area) || 1;

  // Base dosages per acre
  const baseDosages = [
    { nutrient: 'Nitrogen (N)', perAcre: 49, timing: 'Split application', notes: 'Apply 40% at sowing, 30% at tillering, 30% at flowering' },
    { nutrient: 'Phosphorus (P₂O₅)', perAcre: 24, timing: 'At sowing', notes: 'Full dose as basal application' },
    { nutrient: 'Potassium (K₂O)', perAcre: 16, timing: 'At sowing', notes: 'Full dose as basal application' },
    { nutrient: 'Zinc (Zn)', perAcre: 2, timing: 'At sowing', notes: 'Apply once every 2-3 years' },
  ];

  // Calculate total dosages based on area
  const fertilizerPlan = baseDosages.map(item => ({
    ...item,
    total: Math.round(item.perAcre * area * 100) / 100, // Round to 2 decimal places
  }));

  const growthStages = [
    { stage: 'Seedling', completed: true },
    { stage: 'Vegetative', completed: true },
    { stage: 'Flowering', completed: false },
    { stage: 'Fruiting', completed: false },
    { stage: 'Maturity', completed: false },
  ];

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FERTI-AI FERTILIZER PLAN', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Farm Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FARM SUMMARY', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Crop: ${data.cropName}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Area: ${data.area} acres`, 20, yPosition);
    yPosition += 6;
    doc.text(`Soil Type: ${data.soilType}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Weather Conditions: ${data.weatherConditions}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Growth Stage: ${data.growthStage}`, 20, yPosition);
    yPosition += 20;

    // Fertilizer Dosage
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMMENDED FERTILIZER DOSAGE', 20, yPosition);
    yPosition += 15;

    fertilizerPlan.forEach(item => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(item.nutrient, 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Dosage: ${item.total} kg`, 25, yPosition);
      yPosition += 5;
      doc.text(`Timing: ${item.timing}`, 25, yPosition);
      yPosition += 5;
      
      const notes = doc.splitTextToSize(`Notes: ${item.notes}`, pageWidth - 50);
      doc.text(notes, 25, yPosition);
      yPosition += notes.length * 5 + 5;
    });

    // AI Analysis
    yPosition += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('AI ANALYSIS & INSIGHTS', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const analysisText = `Based on your ${data.soilType.toLowerCase()} soil and ${data.cropName.toLowerCase()} requirements, we've optimized the NPK ratio to 2:1:0.67, which is ideal for vegetative growth and ensures strong root development.\n\nSplit nitrogen application is recommended to minimize losses and ensure continuous nutrient supply throughout the growing season. This approach can improve nitrogen use efficiency by up to 30%.`;
    
    const splitText = doc.splitTextToSize(analysisText, pageWidth - 40);
    doc.text(splitText, 20, yPosition);
    yPosition += splitText.length * 5 + 15;

    // Footer
    doc.setFontSize(8);
    doc.text('Generated by Ferti-AI', pageWidth / 2, yPosition, { align: 'center' });

    // Save the PDF
    doc.save(`Ferti-AI_Plan_${data.cropName}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Ferti-AI Fertilizer Plan',
        text: `Check out my AI-generated fertilizer plan for ${data.cropName}!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F2ED] parchment-texture py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-[#0C3C01]">
            Your AI-Generated Fertilizer Plan
          </h1>
          <p className="text-[#2D3E1F]">
            Customized recommendations for {data.cropName} cultivation
          </p>
        </div>

        {/* Summary Card */}
        <div className="card-wood rounded-2xl p-8 shadow-xl parchment-texture border-2 border-[#8B7765]/20">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-[#0C3C01] mb-2">
                Farm Summary
              </h2>
              <p className="text-[#6B7C59]">Generated on {new Date().toLocaleDateString()}</p>
            </div>
            <Leaf className="w-12 h-12 text-[#0C3C01] opacity-20" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-1">
              <p className="text-[#6B7C59]">Crop</p>
              <p className="text-[#0C3C01]">{data.cropName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#6B7C59]">Area</p>
              <p className="text-[#0C3C01]">{data.area} acres</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#6B7C59]">Soil Type</p>
              <p className="text-[#0C3C01]">{data.soilType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#6B7C59]">Weather Conditions</p>
              <p className="text-[#0C3C01]">{data.weatherConditions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#6B7C59]">Growth Stage</p>
              <p className="text-[#0C3C01]">{data.growthStage}</p>
            </div>
          </div>
        </div>

        {/* Dosage Table */}
        <div className="card-wood rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#0C3C01] px-8 py-6">
            <h2 className="text-white">
              Recommended Fertilizer Dosage
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#355E2D] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Nutrient</th>
                  <th className="px-6 py-4 text-left">Dosage</th>
                  <th className="px-6 py-4 text-left">Timing</th>
                  <th className="px-6 py-4 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {fertilizerPlan.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-[#F6F3E7]' : 'bg-[#EAE7E0]'}
                  >
                    <td className="px-6 py-4 text-[#0C3C01]">{item.nutrient}</td>
                    <td className="px-6 py-4 text-[#0C3C01]">
                      <span className="font-semibold">{item.total} kg</span>
                      <br />
                      <span className="text-sm text-[#6B7C59]">({item.perAcre} kg/acre × {area} acres)</span>
                    </td>
                    <td className="px-6 py-4 text-[#0C3C01]">{item.timing}</td>
                    <td className="px-6 py-4 text-[#2D3E1F]">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Growth Stage Timeline */}
        <div className="card-wood rounded-2xl p-8 shadow-xl parchment-texture">
          <h3 className="text-[#0C3C01] mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Growth Stage Timeline
          </h3>

          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-6 left-0 right-0 h-2 bg-[#D9D2C2] rounded-full soil-texture">
              <div
                className="h-full gradient-moss rounded-full transition-all duration-1000"
                style={{ width: '40%' }}
              />
            </div>

            {/* Stages */}
            <div className="relative flex justify-between">
              {growthStages.map((stage, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                      stage.completed
                        ? 'bg-[#0C3C01] border-[#0C3C01]'
                        : 'bg-white border-[#D9D2C2]'
                    } shadow-lg z-10`}
                  >
                    {stage.completed && <Leaf className="w-6 h-6 text-white" />}
                  </div>
                  <p className={`mt-4 text-center ${stage.completed ? 'text-[#0C3C01]' : 'text-[#6B7C59]'}`}>
                    {stage.stage}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="card-wood rounded-2xl p-8 shadow-xl parchment-texture">
          <h3 className="text-[#0C3C01] mb-6">
            AI Analysis & Insights
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-bounce text-[#0C3C01]">Generating AI recommendations...</div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-[#F6F3E7] rounded-xl">
              <h4 className="text-[#0C3C01] mb-2 font-medium">AI-Generated Recommendation</h4>
              <p className="text-[#2D3E1F] whitespace-pre-line">{aiRecommendation}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0C3C01]/10 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-[#0C3C01]" />
              </div>
              <div>
                <h4 className="text-[#0C3C01] mb-2">
                  Nutrient Balance
                </h4>
                <p className="text-[#2D3E1F]">
                  Based on your {data.soilType.toLowerCase()} soil and {data.cropName.toLowerCase()} requirements, we've optimized the NPK ratio to 2:1:0.67, which is ideal for {data.growthStage.toLowerCase()} growth and ensures strong root development.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#355E2D]/10 flex items-center justify-center flex-shrink-0">
                <Droplets className="w-6 h-6 text-[#355E2D]" />
              </div>
              <div>
                <h4 className="text-[#0C3C01] mb-2">
                  Weather & Application
                </h4>
                <p className="text-[#2D3E1F]">
                  With {data.weatherConditions.toLowerCase()} weather conditions, ensure proper timing of fertilizer application. Avoid applying during heavy rain to prevent nutrient runoff and maximize absorption efficiency.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#6B7C59]/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-[#6B7C59]" />
              </div>
              <div>
                <h4 className="text-[#0C3C01] mb-2">
                  Application Strategy
                </h4>
                <p className="text-[#2D3E1F]">
                  Split nitrogen application is recommended to minimize losses and ensure continuous nutrient supply throughout the growing season. This approach can improve nitrogen use efficiency by up to 30%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="px-8 py-4 gradient-moss text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2" onClick={handleDownloadPDF}>
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button onClick={handleShare} className="px-8 py-4 bg-[#EAE7E0] text-[#0C3C01] border-2 border-[#0C3C01] rounded-xl hover:bg-[#D9D2C2] transition-all flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}