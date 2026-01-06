
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Mail, X, ExternalLink, ChevronDown, ChevronUp, BellRing } from 'lucide-react';

export const EmailNotificationToast: React.FC = () => {
  const { activeNotification, closeNotification } = useApp();
  const [showBody, setShowBody] = useState(false);

  if (!activeNotification) return null;

  return (
    <div className="fixed top-24 right-6 z-[200] w-full max-w-sm animate-in slide-in-from-right-10 duration-500">
      <div className="bg-slate-900 text-white rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-3 rounded-2xl shadow-lg shadow-green-900/40">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-1">Email Outbound</p>
                <h4 className="text-sm font-black uppercase italic tracking-tight">Notification Sent</h4>
              </div>
            </div>
            <button onClick={closeNotification} className="text-slate-500 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span className="uppercase tracking-widest">To: {activeNotification.to}</span>
              <span>{activeNotification.timestamp}</span>
            </div>
            <p className="text-xs font-black text-white uppercase tracking-tight">{activeNotification.subject}</p>
          </div>

          <div className="mt-6 flex items-center space-x-3">
            <button 
              onClick={() => setShowBody(!showBody)}
              className="flex-1 flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition"
            >
              <span>{showBody ? 'Hide Content' : 'View Email Content'}</span>
              {showBody ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {showBody && (
          <div className="p-6 bg-white/5 border-t border-white/5 animate-in fade-in slide-in-from-top-4">
            <div className="prose prose-invert prose-sm">
              <div className="text-[11px] leading-relaxed text-slate-300 font-medium whitespace-pre-wrap italic">
                {activeNotification.body}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
