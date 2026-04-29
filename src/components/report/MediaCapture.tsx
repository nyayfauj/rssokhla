// ─── Media Capture (Photos, Audio, Voice-to-Text) ──────────
'use client';

import { useState, useRef } from 'react';

export interface MediaItem {
  id: string;
  type: 'photo' | 'video' | 'audio';
  blob: Blob;
  preview: string;
  name: string;
  size: number;
}

interface Props {
  media: MediaItem[];
  onAdd: (item: MediaItem) => void;
  onRemove: (id: string) => void;
  voiceText: string;
  onVoiceText: (text: string) => void;
}

export default function MediaCapture({ media, onAdd, onRemove, voiceText, onVoiceText }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [recording, setRecording] = useState(false);
  const [listening, setListening] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const type = file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'photo';
      const preview = type === 'photo' ? URL.createObjectURL(file) : '';
      onAdd({ id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type, blob: file, preview, name: file.name, size: file.size });
    });
    if (fileRef.current) fileRef.current.value = '';
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onAdd({ id: `a-${Date.now()}`, type: 'audio', blob, preview: '', name: `recording-${Date.now()}.webm`, size: blob.size });
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch { /* mic denied */ }
  };

  const stopAudioRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const startVoiceToText = () => {
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new (SR as new () => SpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0]?.[0]?.transcript || '';
      onVoiceText(voiceText ? voiceText + ' ' + text : text);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  };

  const formatSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)}KB` : `${(b / (1024 * 1024)).toFixed(1)}MB`;

  return (
    <div className="space-y-3">
      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={() => fileRef.current?.click()}
          className="py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-300 hover:bg-zinc-800 transition-colors active:scale-[0.97] flex flex-col items-center gap-1">
          <span className="text-lg">📷</span>Photo/Video
        </button>
        <button type="button" onClick={recording ? stopAudioRecording : startAudioRecording}
          className={`py-3 border rounded-xl text-xs transition-colors active:scale-[0.97] flex flex-col items-center gap-1 ${
            recording ? 'bg-red-500/15 border-red-500/40 text-red-400' : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
          }`}>
          <span className="text-lg">{recording ? '⏹️' : '🎙️'}</span>{recording ? 'Stop' : 'Record'}
        </button>
        <button type="button" onClick={startVoiceToText} disabled={listening}
          className={`py-3 border rounded-xl text-xs transition-colors active:scale-[0.97] flex flex-col items-center gap-1 ${
            listening ? 'bg-blue-500/15 border-blue-500/40 text-blue-400 animate-pulse' : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
          }`}>
          <span className="text-lg">{listening ? '🔴' : '🗣️'}</span>{listening ? 'Listening...' : 'Voice'}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*,video/*" multiple capture="environment" className="hidden" onChange={handleFileSelect} />

      {/* Voice transcript */}
      {voiceText && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Voice Transcript</span>
            <button type="button" onClick={() => onVoiceText('')} className="text-zinc-600 text-xs">✕</button>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">{voiceText}</p>
        </div>
      )}

      {/* Media preview grid */}
      {media.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {media.map(m => (
            <div key={m.id} className="relative flex-shrink-0 w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {m.type === 'photo' && m.preview ? (
                <img src={m.preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
                  <span className="text-lg">{m.type === 'audio' ? '🎵' : '🎬'}</span>
                  <span className="text-[8px] text-zinc-500">{formatSize(m.size)}</span>
                </div>
              )}
              <button type="button" onClick={() => onRemove(m.id)}
                className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-600 rounded-full text-white text-[8px] flex items-center justify-center">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Type declarations for Speech API
interface SpeechRecognition extends EventTarget {
  lang: string; interimResults: boolean; continuous: boolean;
  onresult: (e: SpeechRecognitionEvent) => void; onend: () => void;
  start: () => void; stop: () => void;
}
interface SpeechRecognitionEvent { results: { [index: number]: { [index: number]: { transcript: string } } }; }
