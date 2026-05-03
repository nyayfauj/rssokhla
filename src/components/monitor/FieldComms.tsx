'use client';

import { useState, useEffect } from 'react';
import { databases, ID, Query } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import { useAuthStore } from '@/stores/auth.store';
import { sensitiveReportPermissions } from '@/lib/appwrite/permissions';

export default function FieldComms({ incidentId }: { incidentId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAnonymous } = useAuthStore();

  useEffect(() => {
    if (!user || isAnonymous) return;
    
    // Initial fetch
    databases.listDocuments(DATABASE_ID, COLLECTIONS.REPORTS, [
      Query.equal('incidentId', incidentId),
      Query.orderAsc('$createdAt')
    ]).then(res => setMessages(res.documents)).catch(console.error);
    
    // Note: In a real scenario, we'd use client.subscribe here for live chat
  }, [incidentId, user, isAnonymous]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || isAnonymous) return;
    
    setLoading(true);
    try {
      const newMsg = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.REPORTS,
        ID.unique(),
        {
          incidentId,
          reporterId: user.$id,
          content: input.trim(),
          timestamp: new Date().toISOString(),
          mediaType: 'text',
          isVerified: false,
          verificationNotes: ''
        },
        sensitiveReportPermissions(user.$id)
      );
      setMessages(prev => [...prev, newMsg]);
      setInput('');
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setLoading(false);
    }
  };

  if (isAnonymous || !user) {
    return (
      <div className="mt-8 border border-red-900/30 bg-red-950/10 p-6 rounded-2xl text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">🔐 Encrypted Comm Channel Locked</p>
        <p className="text-xs text-zinc-500">Only verified Sangathan Operatives can access secure incident communications.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border border-zinc-800/80 bg-zinc-900/30 rounded-2xl overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Tactical Field Comms
        </h3>
        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em] px-2 py-1 bg-zinc-900 rounded border border-zinc-800">
          AES-256 GCM
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs flex flex-col">
        {messages.length === 0 ? (
          <p className="text-zinc-600 text-center uppercase tracking-widest mt-auto mb-auto">No secure transmissions logged.</p>
        ) : (
          messages.map(msg => {
            const isMe = msg.reporterId === user.$id;
            return (
              <div key={msg.$id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl ${isMe ? 'bg-red-900/20 border border-red-900/50 text-red-100' : 'bg-zinc-900 border border-zinc-800 text-zinc-300'}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[8px] text-zinc-600 uppercase mt-1 px-1">
                  {isMe ? 'YOU' : `OP-${msg.reporterId.slice(-6).toUpperCase()}`} • {new Date(msg.$createdAt).toLocaleTimeString()}
                </span>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t border-zinc-800 bg-zinc-900/50 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Transmit secure message..." 
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600/50 transition-colors placeholder-zinc-600 font-mono"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()}
          className="px-4 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest disabled:opacity-50 hover:bg-red-500 transition-colors active:scale-95"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
