'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

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
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (recorderRef.current && recorderRef.current.state === 'recording') {
        recorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      media.forEach(m => {
        if (m.preview) URL.revokeObjectURL(m.preview);
      });
    };
  }, []);

  const handleRemove = useCallback((id: string) => {
    const item = media.find(m => m.id === id);
    if (item?.preview) URL.revokeObjectURL(item.preview);
    onRemove(id);
  }, [media, onRemove]);

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
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onAdd({ id: `a-${Date.now()}`, type: 'audio', blob, preview: '', name: `recording-${Date.now()}.webm`, size: blob.size });
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      console.warn('Microphone access denied');
    }
  };

  const stopAudioRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    setRecording(false);
  };

  const startVoiceToText = () => {
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) {
      console.warn('Speech Recognition API not available');
      return;
    }
    const recognition = new (SR as new () => SpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0]?.[0]?.transcript || '';
      onVoiceText(voiceText ? voiceText + ' ' + text : text);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  };

  const formatSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)}KB` : `${(b / (1024 * 1024)).toFixed(1)}MB`;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={() => fileRef.current?.click()}
          className="py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-zinc-300 hover:bg-zinc-800 transition-colors active:scale-[0.97] flex flex-col items-center gap-1"
          aria-label="Upload photo or video">
          <span className="text-lg" aria-hidden="true">📷</span>Photo/Video
        </button>
        <button type="button" onClick={recording ? stopAudioRecording : startAudioRecording}
          className={`py-3 border rounded-xl text-sm transition-colors active:scale-[0.97] flex flex-col items-center gap-1 ${
            recording ? 'bg-red-500/15 border-red-500/40 text-red-400' : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
          }`}
          aria-label={recording ? 'Stop audio recording' : 'Start audio recording'}>
          <span className="text-lg" aria-hidden="true">{recording ? '⏹️' : '🎙️'}</span>{recording ? 'Stop' : 'Record'}
        </button>
        <button type="button" onClick={startVoiceToText} disabled={listening}
          className={`py-3 border rounded-xl text-sm transition-colors active:scale-[0.97] flex flex-col items-center gap-1 ${
            listening ? 'bg-blue-500/15 border-blue-500/40 text-blue-400 animate-pulse' : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
          }`}
          aria-label={listening ? 'Listening to voice input' : 'Start voice to text'}>
          <span className="text-lg" aria-hidden="true">{listening ? '🔴' : '🗣️'}</span>{listening ? 'Listening...' : 'Voice'}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*,video/*" multiple capture="environment" className="hidden" onChange={handleFileSelect} />

      {voiceText && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Voice Transcript</span>
            <button type="button" onClick={() => onVoiceText('')} className="text-zinc-600 hover:text-zinc-400 text-sm" aria-label="Clear voice transcript">✕</button>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{voiceText}</p>
        </div>
      )}

      {media.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {media.map(m => (
            <div key={m.id} className="relative flex-shrink-0 w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              {m.type === 'photo' && m.preview ? (
                <img src={m.preview} alt={`Uploaded ${m.name}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
                  <span className="text-lg" aria-hidden="true">{m.type === 'audio' ? '🎵' : '🎬'}</span>
                  <span className="text-xs text-zinc-500">{formatSize(m.size)}</span>
                </div>
              )}
              <button type="button" onClick={() => handleRemove(m.id)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-500 transition-colors"
                aria-label={`Remove ${m.name}`}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface SpeechRecognition extends EventTarget {
  lang: string; interimResults: boolean; continuous: boolean;
  onresult: (e: SpeechRecognitionEvent) => void; onend: () => void; onerror: () => void;
  start: () => void; stop: () => void;
}
interface SpeechRecognitionEvent { results: { [index: number]: { [index: number]: { transcript: string } } }; }
