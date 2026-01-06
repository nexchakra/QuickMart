
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useApp } from '../store/AppContext';
import { Sparkles, X, Send, Loader2, ChefHat, ExternalLink, Globe } from 'lucide-react';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string, links?: { uri: string, title: string }[] }[]>([
    { role: 'bot', text: "Hi! I'm Quickie. I now have real-time Google Search access! Ask me about current grocery prices, seasonal trends, or fresh recipes." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { cart, products } = useApp();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Create new instance before making the API call to ensure latest configuration
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentCartItems = cart.map(i => `${i.name} (${i.quantity}x)`).join(', ');
      
      const prompt = `User's Cart Context: [${currentCartItems}]. 
      Store Inventory: [${products.map(p => p.name).join(', ')}].
      User Question: ${userMsg}. 
      Task: Provide a helpful, intelligent response under 120 words. 
      Use Google Search to find real-time info if they ask about prices, trends, or complex recipes. 
      Be encouraging and mention the "QuickPoints" loyalty system if relevant.`;

      const response = await ai.models.generateContent({
        // Using gemini-3-flash-preview for general text grounding task as per guidelines
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      // Extract URLs from groundingChunks as required by guidelines when using googleSearch
      const groundingLinks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Learn more'
      })).filter((l: any) => l.uri) || [];

      setMessages(prev => [...prev, { 
        role: 'bot', 
        // Use .text property to extract output string
        text: response.text || "I processed that but couldn't generate a clear answer. Try rephrasing!",
        links: groundingLinks
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: "Quickie's brain is temporarily offline. Please try again in a few seconds." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white w-[380px] h-[550px] rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          <div className="bg-green-600 p-8 flex items-center justify-between text-white relative overflow-hidden">
            <div className="relative z-10 flex items-center space-x-4">
              <div className="bg-white/20 p-2.5 rounded-2xl">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black tracking-tight leading-none uppercase text-xs">Quickie AI</p>
                <div className="flex items-center mt-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-green-100 uppercase tracking-widest">Enhanced Intelligence</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="relative z-10 p-2 hover:bg-white/10 rounded-xl transition">
              <X className="w-5 h-5" />
            </button>
            <Sparkles className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-5 rounded-[2rem] text-sm font-medium shadow-sm leading-relaxed ${
                  m.role === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
                {m.links && m.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.links.slice(0, 2).map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-blue-100 transition"
                      >
                        <Globe className="w-2.5 h-2.5 mr-1.5" /> {link.title.substring(0, 15)}...
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-5 rounded-[2rem] rounded-bl-none shadow-sm flex items-center space-x-3">
                  <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Searching the web...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t flex space-x-3 items-center">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about trends or recipes..."
              className="flex-1 bg-gray-100 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="bg-green-600 text-white p-4 rounded-2xl hover:bg-green-700 transition-all disabled:opacity-50 shadow-lg shadow-green-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-green-600 text-white p-6 rounded-[2rem] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative overflow-hidden"
        >
          <Sparkles className="w-6 h-6 relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-green-700 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="absolute -top-14 right-0 bg-gray-900 text-white text-[10px] font-black px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-2xl">
            Ask Quickie Assistant ✨
          </span>
        </button>
      )}
    </div>
  );
};
