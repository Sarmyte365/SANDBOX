
import React, { useState } from 'react';
import { AppStatus } from './types';
import { generateProverbStory, generateProverbIllustration } from './services/geminiService';
import CandleVisual from './components/CandleVisual';

const POPULAR_PROVERBS = [
  "Neturi sveci zem pūra",
  "Darbs dara darītāju",
  "Ko sēsi, to pļausi",
  "Runāšana sudrabs, klusēšana zelts",
  "Nav pēc vārda kabatā jāmeklē"
];

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [currentProverb, setCurrentProverb] = useState<string>("Neturi sveci zem pūra");
  const [inputValue, setInputValue] = useState<string>("");
  const [storyData, setStoryData] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetData = () => {
    setStoryData(null);
    setImageUrl(null);
    setError(null);
  };

  const handleProverbChange = (newProverb: string) => {
    setCurrentProverb(newProverb);
    setInputValue("");
    resetData();
  };

  const handleExplore = async () => {
    if (!currentProverb.trim()) return;
    try {
      setStatus(AppStatus.LOADING_TEXT);
      setError(null);
      const data = await generateProverbStory(currentProverb);
      setStoryData(data);
      setStatus(AppStatus.IDLE);
    } catch (err: any) {
      console.error(err);
      setError("Neizdevās ielādēt skaidrojumu. Mēģiniet vēlreiz.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleIllustrate = async () => {
    if (!currentProverb.trim()) return;
    try {
      setStatus(AppStatus.LOADING_IMAGE);
      setError(null);
      const url = await generateProverbIllustration(currentProverb);
      setImageUrl(url);
      setStatus(AppStatus.IDLE);
    } catch (err: any) {
      console.error(err);
      setError("Neizdevās ģenerēt ilustrāciju. Mēģiniet vēlreiz.");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative py-12 px-6 text-center bg-wood border-b border-amber-900/50">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-4 text-amber-600/60 uppercase tracking-[0.3em] font-semibold text-xs">
            Latviešu Tautas Gudrība
          </div>
          <CandleVisual />
          
          <div className="mt-8 w-full max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-amber-50 drop-shadow-lg mb-8 italic serif">
              "{currentProverb}"
            </h1>
            
            <div className="relative group">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ievadi citu latviešu sakāmvārdu..."
                className="w-full px-6 py-4 bg-slate-900/80 border-2 border-amber-900/50 rounded-2xl text-amber-50 placeholder-amber-900/50 focus:outline-none focus:border-amber-600 transition-all text-lg shadow-inner"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputValue.trim()) {
                    handleProverbChange(inputValue);
                  }
                }}
              />
              <button 
                onClick={() => inputValue.trim() && handleProverbChange(inputValue)}
                className="absolute right-2 top-2 bottom-2 px-6 bg-amber-700 hover:bg-amber-600 text-white rounded-xl transition-colors font-semibold"
              >
                Mainīt
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {POPULAR_PROVERBS.map(p => (
                <button
                  key={p}
                  onClick={() => handleProverbChange(p)}
                  className={`text-xs px-3 py-1 rounded-full border transition-all ${
                    currentProverb === p 
                    ? 'bg-amber-600/30 text-amber-200 border-amber-600/50' 
                    : 'bg-amber-900/20 hover:bg-amber-900/40 text-amber-200/60 border-amber-900/30'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleExplore}
              disabled={status !== AppStatus.IDLE || !currentProverb}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
            >
              {status === AppStatus.LOADING_TEXT ? 'Pētām gudrību...' : 'Izpētīt Nozīmi'}
            </button>
            <button 
              onClick={handleIllustrate}
              disabled={status !== AppStatus.IDLE || !currentProverb}
              className="px-8 py-3 bg-transparent border-2 border-amber-600 hover:bg-amber-600/10 disabled:opacity-50 text-amber-400 font-semibold rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              {status === AppStatus.LOADING_IMAGE ? 'Gleznojam...' : 'Ilustrēt Sakāmvārdu'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-6 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Explanation Section */}
          <section className="space-y-8">
            {!storyData && !imageUrl && status === AppStatus.IDLE && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-3xl p-12 text-slate-500">
                <svg className="w-16 h-16 mb-4 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
                <p className="text-center italic">Atklājiet sakāmvārda dziļāko jēgu un vēsturi.</p>
              </div>
            )}

            {storyData && (
              <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 shadow-xl animate-fade-in backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-amber-400 mb-6 serif italic">Gudrības Stāsts</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-2">Kas tas ir?</h3>
                    <p className="text-lg text-slate-200 leading-relaxed">{storyData.definition}</p>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-2">Vēsturiskais fons</h3>
                    <p className="text-slate-300 leading-relaxed italic serif">{storyData.history}</p>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-2">Mūsdienu lietojums</h3>
                    <p className="text-slate-200 leading-relaxed">{storyData.modernUsage}</p>
                  </div>

                  <div className="bg-amber-900/20 p-6 rounded-2xl border-l-4 border-amber-600 shadow-lg">
                    <h3 className="text-sm uppercase tracking-widest text-amber-500 font-bold mb-3">Tautas gudrība darbībā</h3>
                    <p className="text-lg text-amber-50 italic serif leading-relaxed">
                      "{storyData.story}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Visual Section */}
          <section className="sticky top-6">
            {imageUrl ? (
              <div className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-amber-500/20">
                <img 
                  src={imageUrl} 
                  alt={currentProverb} 
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <p className="text-white text-sm">Vizuālā interpretācija sakāmvārdam: "{currentProverb}"</p>
                </div>
              </div>
            ) : status === AppStatus.LOADING_IMAGE ? (
              <div className="aspect-video bg-slate-800 animate-pulse rounded-3xl flex items-center justify-center border border-slate-700">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <span className="text-slate-400 font-medium tracking-wide">AI glezno viedumu...</span>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-slate-800/20 border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-500 group hover:border-amber-900/50 transition-colors">
                <svg className="w-12 h-12 mb-4 opacity-10 group-hover:opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-medium">Nospiediet pogu augstāk, lai ģenerētu ilustrāciju</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="py-12 px-6 bg-slate-950/50 text-center text-slate-500 border-t border-slate-800 mt-12">
        <div className="max-w-xl mx-auto">
          <h2 className="text-amber-600 font-bold text-lg mb-2 serif tracking-wider">Neturi sveci zem pūra</h2>
          <p className="text-sm italic mb-4">"Gudrs padoms dārgāks par zeltu."</p>
          <div className="flex justify-center gap-4 opacity-50 text-[10px] uppercase tracking-[0.2em]">
            <span>Tradīcija</span>
            <span>•</span>
            <span>Mākslīgais Intelekts</span>
            <span>•</span>
            <span>Mantojums</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
