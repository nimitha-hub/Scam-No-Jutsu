/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Search, RefreshCw, ExternalLink, Lock, BookOpen, X, Phone, MessageSquare, Image as ImageIcon, Sparkles, Wind, Zap, Droplets, Flame, Mountain, Scroll } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { analyzePhishing, generateScamDiagram, generateNarutoSensei, type PhishAnalysis } from './lib/gemini';
import { KERALA_SCAM_KNOWLEDGE_BASE } from './lib/knowledgeBase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NARUTO_TIPS = [
  { en: "Remember the 2-hour Golden Hour!", ml: "ആദ്യത്തെ 2 മണിക്കൂർ വളരെ പ്രധാനമാണ്!" },
  { en: "Freebies are traps!", ml: "സൗജന്യങ്ങൾ എപ്പോഴും പാരയാണ്!" },
  { en: "Check the domain carefully, 'tebayo!", ml: "ഡൊമെയ്ൻ ശ്രദ്ധിച്ചു പരിശോധിക്കൂ, 'തേബായോ!" },
  { en: "Never share your OTP with anyone!", ml: "ഒടിപി ആരുമായും പങ്കുവെക്കരുത്!" },
  { en: "Official banks never call for passwords!", ml: "ബാങ്കുകൾ ഒരിക്കലും പാസ്‌വേഡ് ചോദിക്കില്ല!" }
];

const TypewriterText = ({ text, speed = 10 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    // If text is being updated via streaming, we want to catch up quickly
    if (text.length > displayedText.length) {
      setDisplayedText(text);
    }
  }, [text]);

  return <span>{displayedText}</span>;
};

export default function App() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PhishAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showKB, setShowKB] = useState(false);
  const [kbPage, setKbPage] = useState<'scams' | 'hotlines' | 'diagram'>('scams');
  const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
  const [diagramError, setDiagramError] = useState<string | null>(null);
  const [selectedScamForDiagram, setSelectedScamForDiagram] = useState(KERALA_SCAM_KNOWLEDGE_BASE.categories[0].name);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [narutoAvatar, setNarutoAvatar] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const fetchNarutoAvatar = async () => {
    setIsGeneratingAvatar(true);
    try {
      // Check cache first
      const cachedAvatar = sessionStorage.getItem('naruto_avatar');
      if (cachedAvatar) {
        setNarutoAvatar(cachedAvatar);
        setIsGeneratingAvatar(false);
        return;
      }

      const url = await generateNarutoSensei();
      setNarutoAvatar(url);
      sessionStorage.setItem('naruto_avatar', url);
    } catch (err) {
      console.error("Failed to generate Naruto avatar:", err);
      setNarutoAvatar("https://picsum.photos/seed/naruto-avatar/200/200");
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  useEffect(() => {
    fetchNarutoAvatar();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % NARUTO_TIPS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null); // Clear previous result
    
    try {
      const analysis = await analyzePhishing(input, (partial) => {
        // Update result partially as data streams in
        setResult((prev) => {
          if (!prev) return partial as PhishAnalysis;
          return { ...prev, ...partial };
        });
      });
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateDiagram = async () => {
    setIsGeneratingDiagram(true);
    setDiagramError(null);
    try {
      // Check cache first
      const cacheKey = `diagram_${selectedScamForDiagram}`;
      const cachedDiagram = sessionStorage.getItem(cacheKey);
      if (cachedDiagram) {
        setDiagramUrl(cachedDiagram);
        setIsGeneratingDiagram(false);
        return;
      }

      const url = await generateScamDiagram(selectedScamForDiagram);
      setDiagramUrl(url);
      sessionStorage.setItem(cacheKey, url);
    } catch (err) {
      setDiagramError(err instanceof Error ? err.message : 'Failed to generate diagram');
      console.error(err);
    } finally {
      setIsGeneratingDiagram(false);
    }
  };

  useEffect(() => {
    if (kbPage === 'diagram' && !diagramUrl && !isGeneratingDiagram) {
      handleGenerateDiagram();
    }
  }, [kbPage, selectedScamForDiagram]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('scamnojutsu_tour_seen');
    if (!hasSeenTour) {
      const driverObj = driver({
        showProgress: true,
        popoverClass: 'driverjs-theme',
        steps: [
          { 
            element: '#tour-input', 
            popover: { 
              title: 'The Dojo Entrance', 
              description: 'Welcome to the Dojo! Paste any suspicious link or message you\'ve received here.',
              side: "bottom",
              align: 'start'
            } 
          },
          { 
            element: '#tour-scan-btn', 
            popover: { 
              title: 'Chakra Scan', 
              description: 'Click here to let Gemini perform a Chakra Scan on the content.',
              side: "bottom",
              align: 'start'
            } 
          },
          { 
            element: '#tour-prevent-scams-btn', 
            popover: { 
              title: 'Scroll of Truth', 
              description: 'Don’t miss this! Click here to see our Infographic Guides and Malayalam safety videos.',
              side: "bottom",
              align: 'end'
            } 
          },
          { 
            element: '#tour-result-area', 
            popover: { 
              title: 'The Result', 
              description: 'Your safety analysis will appear here with a Trust Meter and Chakra Element.',
              side: "left",
              align: 'start'
            } 
          },
        ],
        onDestroyStarted: () => {
          localStorage.setItem('scamnojutsu_tour_seen', 'true');
          driverObj.destroy();
        }
      });

      driverObj.drive();
    }
  }, []);

  const getChakraIcon = (element: string) => {
    switch (element) {
      case '🔥': return <Flame className="w-8 h-8 text-orange" />;
      case '💧': return <Droplets className="w-8 h-8 text-blue-400" />;
      case '⚡': return <Zap className="w-8 h-8 text-warning" />;
      case '💨': return <Wind className="w-8 h-8 text-light-gray" />;
      case '🪨': return <Mountain className="w-8 h-8 text-amber-800" />;
      default: return <Sparkles className="w-8 h-8 text-navy" />;
    }
  };

  return (
    <div className="min-h-screen ninja-bg selection:bg-orange selection:text-white pb-24">
      <div className="chakra-aura" />
      {/* Header */}
      <header className="border-b border-white/5 bg-dark-main/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange flex items-center justify-center shadow-lg shadow-orange/20">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-sans font-black text-2xl tracking-tight text-white">
                SCAM NO <span className="font-jutsu text-orange text-3xl ml-1">Jutsu</span>
              </h1>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">Cybersecurity Mentor // Kerala</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              id="tour-prevent-scams-btn"
              onClick={() => setShowKB(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange text-white text-xs font-bold uppercase tracking-widest hover:bg-orange/90 transition-all shadow-lg group relative"
            >
              <Scroll className="w-4 h-4" />
              Scroll of Truth
              <span className="absolute -top-4 -right-2 px-2 py-1 bg-warning text-black text-[7px] font-black rounded-md border border-black/10 shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform">
                സൗജന്യ സുരക്ഷാ ഗൈഡുകൾ
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Knowledge Base Modal */}
      <AnimatePresence>
        {showKB && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/60 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              className="w-full h-full max-w-6xl glass-card rounded-[40px] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="font-jutsu text-3xl text-white">Scroll of Truth</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <button 
                        onClick={() => setKbPage('scams')}
                        className={cn("text-[10px] font-mono uppercase tracking-widest transition-colors font-bold", kbPage === 'scams' ? "text-orange" : "text-white/40 hover:text-white/60")}
                      >
                        Scam Catalog
                      </button>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <button 
                        onClick={() => setKbPage('diagram')}
                        className={cn("text-[10px] font-mono uppercase tracking-widest transition-colors font-bold", kbPage === 'diagram' ? "text-orange" : "text-white/40 hover:text-white/60")}
                      >
                        Safety Diagrams
                      </button>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <button 
                        onClick={() => setKbPage('hotlines')}
                        className={cn("text-[10px] font-mono uppercase tracking-widest transition-colors font-bold", kbPage === 'hotlines' ? "text-orange" : "text-white/40 hover:text-white/60")}
                      >
                        Emergency Hotlines
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowKB(false)}
                  className="p-3 rounded-full hover:bg-white/5 transition-colors"
                >
                  <X className="w-8 h-8 text-white/20" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-dark-secondary/50">
                {kbPage === 'scams' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {KERALA_SCAM_KNOWLEDGE_BASE.categories.map((cat) => (
                      <motion.div 
                        key={cat.name} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange/30 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <Shield className="w-16 h-16 text-white" />
                        </div>
                        <h3 className="font-jutsu text-2xl text-white mb-3 group-hover:translate-x-1 transition-transform">{cat.name}</h3>
                        <p className="text-sm text-white/60 leading-relaxed mb-6">{cat.description}</p>
                        <div className="space-y-3">
                          <p className="text-[10px] font-mono text-orange uppercase tracking-widest font-bold">Red Flags</p>
                          <ul className="space-y-2">
                            {cat.redFlags.map((flag, i) => (
                              <li key={i} className="text-xs text-white/40 flex items-start gap-3">
                                <AlertTriangle className="w-3.5 h-3.5 text-orange shrink-0 mt-0.5" />
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {kbPage === 'diagram' && (
                  <div className="max-w-4xl mx-auto space-y-10">
                    <div className="flex flex-wrap gap-3 justify-center">
                      {KERALA_SCAM_KNOWLEDGE_BASE.categories.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => {
                            setSelectedScamForDiagram(cat.name);
                            setDiagramUrl(null);
                          }}
                          className={cn(
                            "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                            selectedScamForDiagram === cat.name 
                              ? "bg-orange text-white shadow-lg shadow-orange/20" 
                              : "bg-white/5 text-white/40 hover:bg-white/10"
                          )}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    <div className="aspect-video rounded-[32px] bg-white/5 border border-white/10 overflow-hidden relative flex items-center justify-center">
                      {isGeneratingDiagram ? (
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-orange animate-spin mx-auto" />
                          <p className="font-jutsu text-3xl text-white animate-pulse">Unrolling Scroll...</p>
                          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">AI Visualization Engine</p>
                        </div>
                      ) : diagramError ? (
                        <div className="text-center space-y-4 p-8">
                          <AlertTriangle className="w-16 h-16 text-orange mx-auto" />
                          <p className="text-white font-bold">Failed to Visualize</p>
                          <p className="text-xs text-white/50 max-w-xs mx-auto">{diagramError}</p>
                          <button 
                            onClick={handleGenerateDiagram}
                            className="px-6 py-2 rounded-xl bg-orange text-white text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all"
                          >
                            Try Again
                          </button>
                        </div>
                      ) : diagramUrl ? (
                        <motion.img 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          src={diagramUrl} 
                          className="w-full h-full object-cover" 
                          alt="Scam Diagram"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center space-y-4">
                          <ImageIcon className="w-16 h-16 text-white/10 mx-auto" />
                          <p className="text-white/40 text-sm">Select a category to visualize the Gen-Jutsu</p>
                        </div>
                      )}
                      
                      {diagramUrl && !isGeneratingDiagram && (
                        <button 
                          onClick={handleGenerateDiagram}
                          className="absolute bottom-8 right-8 p-4 rounded-full bg-white shadow-xl border border-white/10 text-orange hover:scale-110 transition-all"
                        >
                          <RefreshCw className="w-6 h-6" />
                        </button>
                      )}
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-orange/5 border border-orange/10 flex items-center gap-6">
                      <Sparkles className="w-8 h-8 text-orange shrink-0" />
                      <p className="text-sm text-white/60 leading-relaxed">
                        This diagram is generated in real-time to visualize the <span className="text-orange font-bold">{selectedScamForDiagram}</span>. Use it to understand the fraudster's technique.
                      </p>
                    </div>
                  </div>
                )}

                {kbPage === 'hotlines' && (
                  <div className="max-w-3xl mx-auto space-y-12 py-10">
                    <div className="text-center space-y-4">
                      <h3 className="font-jutsu text-4xl text-white">Emergency Jutsu</h3>
                      <p className="text-white/60 text-sm">If you have lost money or are being threatened, contact these official channels immediately.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {KERALA_SCAM_KNOWLEDGE_BASE.emergencyContacts.map((contact) => (
                        <div key={contact.name} className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-xl transition-all">
                          <div className="flex items-center gap-6">
                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border", contact.type === 'call' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-blue-500/10 border-blue-500/20 text-blue-500")}>
                              {contact.type === 'call' ? <Phone className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
                            </div>
                            <div>
                              <h4 className="font-jutsu text-2xl text-white">{contact.name}</h4>
                              <p className="font-mono text-2xl tracking-tighter text-white/80 font-bold">{contact.number}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-4 w-full md:w-auto">
                            {contact.type === 'call' ? (
                              <a 
                                href={`tel:${contact.number}`}
                                className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-green-600 text-white font-sans font-black text-sm uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-600/20"
                              >
                                <Phone className="w-5 h-5" />
                                Call Now
                              </a>
                            ) : (
                              <a 
                                href={`sms:${contact.number}`}
                                className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-blue-600 text-white font-sans font-black text-sm uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
                              >
                                <MessageSquare className="w-5 h-5" />
                                Send SMS
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-10 rounded-[40px] bg-orange/5 border border-orange/10 text-center space-y-4">
                      <AlertTriangle className="w-12 h-12 text-orange mx-auto" />
                      <h4 className="font-jutsu text-3xl text-orange">Golden Hour Rule</h4>
                      <p className="text-sm text-white/60 max-w-xl mx-auto leading-relaxed">
                        Report financial fraud within the <span className="text-white font-bold">first 2 hours</span> (Golden Hour) to increase the chances of freezing the stolen money.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="bento-grid">
          {/* Input Card */}
          <div className="lg:col-span-2 lg:row-span-2 glass-card p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-jutsu text-3xl text-white">Chakra Scan</h2>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                <span className="text-[10px] font-mono text-white/60 uppercase font-bold">Dojo Ready</span>
              </div>
            </div>
            
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              Paste any suspicious link or message. Naruto Sensei will perform a <span className="text-orange font-bold">Gen-Jutsu Detection</span> scan.
            </p>

            <div className="flex-1 relative group mb-6">
              <textarea
                id="tour-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste message or link here..."
                className="w-full h-full min-h-[200px] bg-white/5 border border-white/10 rounded-2xl p-6 text-sm focus:outline-none focus:border-orange/30 transition-all resize-none font-sans leading-relaxed text-white placeholder:text-white/20"
              />
              <div className="absolute bottom-4 right-6 flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase font-bold">
                <Lock className="w-3.5 h-3.5" />
                Encrypted Scan
              </div>
            </div>

            <button
              id="tour-scan-btn"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !input.trim()}
              className={cn(
                "w-full py-5 rounded-2xl font-sans font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl",
                isAnalyzing 
                  ? "bg-orange/20 text-orange cursor-not-allowed border border-orange/20 pulse-orange" 
                  : !input.trim()
                    ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                    : "bg-orange text-white hover:scale-[1.02] active:scale-[0.98] shadow-orange/20"
              )}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Perform Scan
                </>
              )}
            </button>
            
            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Result Card */}
          <div className="lg:col-span-2 lg:row-span-3 glass-card p-8 relative overflow-hidden" id="tour-result-area">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                    <ShieldCheck className="w-12 h-12 text-white/20" />
                  </div>
                  <h3 className="font-jutsu text-2xl mb-2 text-white/40">Awaiting Input</h3>
                  <p className="text-white/30 text-sm max-w-xs">
                    The Scroll of Truth will reveal the nature of the Gen-Jutsu here.
                  </p>
                </motion.div>
              ) : isAnalyzing && !result ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center p-8 space-y-8"
                >
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-white/5 border-t-orange chakra-loading" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-12 h-12 text-orange" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="font-jutsu text-3xl text-white animate-pulse">Chakra Charging...</h3>
                    <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest font-bold">Analyzing Spiritual Energy</p>
                  </div>
                </motion.div>
              ) : result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col"
                >
                  {/* Trust Meter */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">Trust Meter</span>
                      <span className={cn("text-lg font-black", (result.scamScore || 0) > 70 ? "text-orange" : (result.scamScore || 0) > 30 ? "text-warning" : "text-green-400")}>
                        {100 - (result.scamScore || 0)}% Safe
                      </span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - (result.scamScore || 0)}%` }}
                        className={cn("h-full transition-all duration-1000", 
                          (result.scamScore || 0) > 70 ? "bg-orange" : (result.scamScore || 0) > 30 ? "bg-warning" : "bg-green-400"
                        )}
                      />
                    </div>
                  </div>

                  {/* Chakra Element Icon */}
                  <div className="flex items-center gap-6 mb-8 p-6 rounded-3xl bg-white/5 border border-white/10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shadow-sm border border-white/10">
                      {getChakraIcon(KERALA_SCAM_KNOWLEDGE_BASE.categories.find(c => c.name === result.theTea?.split(' ')[0])?.chakraElement || '⚡')}
                    </div>
                    <div>
                      <h4 className="font-jutsu text-xl text-white">
                        {KERALA_SCAM_KNOWLEDGE_BASE.categories.find(c => c.name === result.theTea?.split(' ')[0])?.chakraLabel || 'Chakra of Detection'}
                      </h4>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">
                        {isAnalyzing ? "Elemental Analysis in Progress..." : "Elemental Analysis Complete"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-sm">
                      <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold mb-3">The Tea (English)</h4>
                      <p className="text-sm leading-relaxed text-white/80">
                        <TypewriterText text={result.theTea || "Analyzing..."} />
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-orange/5 border border-orange/10">
                      <h4 className="text-[10px] font-mono text-orange uppercase tracking-widest font-bold mb-3">മലയാളം വിവരണം (Malayalam)</h4>
                      <p className="text-sm leading-relaxed text-white font-medium">
                        <TypewriterText text={result.malayalamExplanation || "വിശകലനം ചെയ്യുന്നു..."} />
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h5 className="text-[10px] font-mono text-orange uppercase tracking-widest font-bold mb-2">Red Flags</h5>
                      <ul className="space-y-1">
                        {(result.redFlags || []).map((flag, i) => (
                          <li key={i} className="text-[10px] text-white/60 flex items-start gap-2">
                            <span className="text-orange">🚩</span> {flag}
                          </li>
                        ))}
                        {isAnalyzing && !(result.redFlags?.length) && (
                          <li className="text-[10px] text-white/20 animate-pulse">Searching for flags...</li>
                        )}
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <h5 className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold mb-2">Action</h5>
                      <p className="text-[10px] text-white/60 leading-tight">
                        {result.action || (isAnalyzing ? "Preparing counter-jutsu..." : "No action required.")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Emergency Card */}
          <div className="lg:col-span-2 glass-card p-8 flex flex-col justify-center items-center text-center">
            <h3 className="font-jutsu text-2xl text-white mb-4">Emergency Jutsu</h3>
            <div className="flex flex-col w-full gap-4">
              <a 
                href="tel:1930"
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-orange text-white font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-orange/20"
              >
                <Phone className="w-5 h-5" />
                Call 1930
              </a>
              <button 
                onClick={() => {
                  setShowKB(true);
                  setKbPage('hotlines');
                }}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 text-white border border-white/10 font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
              >
                <ShieldAlert className="w-5 h-5" />
                Report to Cyberdome
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Naruto Avatar & Tips */}
      <div className="fixed bottom-8 right-8 z-[60] flex flex-col items-end gap-4 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentTipIndex}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="glass-card p-6 rounded-[32px] rounded-br-none shadow-2xl max-w-xs pointer-events-auto relative bg-dark-secondary/90 border-orange/20"
          >
            <div className="absolute -bottom-2 right-0 w-4 h-4 bg-dark-secondary border-r-2 border-b-2 border-orange/20 transform rotate-45" />
            <p className="text-xs font-bold text-white mb-2 leading-relaxed">{NARUTO_TIPS[currentTipIndex].en}</p>
            <p className="text-[10px] font-medium text-orange leading-relaxed">{NARUTO_TIPS[currentTipIndex].ml}</p>
          </motion.div>
        </AnimatePresence>
        
          <div className="w-24 h-24 relative pointer-events-auto group">
          <div className="absolute inset-0 bg-orange/20 rounded-full blur-2xl group-hover:bg-orange/30 transition-all" />
          {isGeneratingAvatar ? (
            <div className="w-full h-full rounded-full border-4 border-orange/20 bg-dark-secondary flex items-center justify-center animate-pulse relative z-10">
              <RefreshCw className="w-8 h-8 text-orange animate-spin" />
            </div>
          ) : (
            <img 
              src={narutoAvatar || "https://picsum.photos/seed/naruto-avatar/200/200"} 
              alt="Naruto Sensei" 
              className="w-full h-full object-cover rounded-full border-4 border-orange/20 shadow-xl relative z-10"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange rounded-full border-2 border-dark-main flex items-center justify-center shadow-lg z-20">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 text-center space-y-4">
        <button 
          onClick={() => {
            localStorage.removeItem('scamnojutsu_tour_seen');
            window.location.reload();
          }}
          className="text-[10px] font-mono text-white/20 uppercase tracking-widest hover:text-orange transition-colors font-bold"
        >
          [ Restart Onboarding Tour ]
        </button>
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] font-bold">
          Scam No Jutsu v1.1.0 // Powered by Google Gemini // Made by team Scam No Jutsu
        </p>
      </footer>
    </div>
  );
}
