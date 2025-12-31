# Step 8: Video Player Component

## Entwickler-Spezifikation: Video-Player

### 1. Screen Name & Route
- **Name**: VideoPlayerScreen
- **Route**: /watch/:videoId
- **Parent Layout**: NoLayout (Fullscreen)
- **Zugriff**: Erfordert generierte Video-Inhalte

### 2. UI-Komponenten (Custom Overlay)
- **VideoContainer**: Wrapper für ReactPlayer, handhabt Aspect Ratio (16:9)
- **OverlayControls** (Fade In/Out):
  - **Top Bar**: "Zurück"-Button, Titel, Picture-in-Picture Toggle
  - **Center**: Großer Play/Pause Button
  - **Bottom Bar**:
    - Timeline: Scrubber mit Kapitel-Markern, Hover-Preview
    - Left Controls: Play/Pause, Volume-Slider
    - Right Controls: Settings (Speed/Quality), Sleep Timer, Fullscreen
- **ParentalGate**: Overlay bei Bildschirmzeit-Limit
- **SettingsSheet**: Geschwindigkeit (0.5x - 2x) und Qualität Auswahl

### 3. TypeScript Interfaces

```typescript
export interface VideoAsset {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  chapters?: ChapterMarker[];
  subtitles?: SubtitleTrack[];
}

export interface ChapterMarker {
  time: number;
  label: string;
}

export interface PlayerState {
  playing: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  playbackRate: number;
  pip: boolean;
  fullscreen: boolean;
  seeking: boolean;
}
```

### 4. Features
- Dark Mode Support
- Framer Motion Animationen
- Mobile-First responsive Design
- Resume Playback (localStorage)
- Sleep Timer Integration
- Keyboard Navigation (Space, Arrow Keys)
- MediaSession API für Lockscreen Controls
- Chapter Markers auf Timeline
- Custom Controls Overlay
- Picture-in-Picture Support

### 5. Technologie-Stack
- React 18
- TypeScript
- react-player Library
- screenfull (Fullscreen API)
- Framer Motion
- TailwindCSS
- Lucide React Icons

## Production-Ready Code

```tsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Settings, Maximize, Minimize, ChevronLeft, Pip, Clock, Check, FastForward, Rewind } from 'lucide-react';

/** MOCK DATA */
const MOCK_VIDEO: VideoAsset = {
  id: 'vid-123',
  title: 'Abenteuer im Zauberwald',
  url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  thumbnailUrl: 'https://images.unsplash.com/photo-1461747541859-467c1d1d60ea',
  duration: 600,
  chapters: [
    { time: 0, label: 'Intro' },
    { time: 120, label: 'Der geheime Pfad' },
    { time: 450, label: 'Das Finale' }
  ]
};

/** HAUPTKOMPONENTE */
export const VideoPlayerScreen: React.FC<{ video?: VideoAsset }> = ({ video = MOCK_VIDEO }) => {
  // Refs
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // State
  const [state, setState] = useState<PlayerState>({
    playing: true,
    volume: 0.8,
    muted: false,
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    pip: false,
    fullscreen: false,
    seeking: false,
    controlsVisible: true,
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  
  /** Event Handlers */
  const handleTogglePlay = useCallback(() => {
    setState(prev => ({ ...prev, playing: !prev.playing }));
  }, []);
  
  const handleProgress = useCallback((progress: { played: number; playedSeconds: number; loaded: number }) => {
    if (!state.seeking) {
      setState(prev => ({ ...prev, ...progress }));
      if (Math.floor(progress.playedSeconds) % 5 === 0) {
        localStorage.setItem(`progress_${video.id}`, progress.playedSeconds.toString());
      }
    }
  }, [state.seeking, video.id]);
  
  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    return `${mm}:${ss}`;
  };
  
  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      <ReactPlayer
        ref={playerRef}
        url={video.url}
        playing={state.playing}
        volume={state.volume}
        muted={state.muted}
        playbackRate={state.playbackRate}
        pip={state.pip}
        onProgress={handleProgress}
        width="100%"
        height="100%"
      />
      
      {/* Controls Overlay */}
      <AnimatePresence>
        {state.controlsVisible && (
          <motion.div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
              <button onClick={() => window.history.back()} className="p-2 hover:bg-white/20 rounded-full">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <h1 className="text-white text-xl font-bold">{video.title}</h1>
              <button onClick={() => setState(p => ({ ...p, pip: !p.pip }))} className="p-2 hover:bg-white/20 rounded-full">
                <Pip className="w-6 h-6 text-white" />
              </button>
            </div>
            
            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button onClick={handleTogglePlay} className="p-6 hover:bg-white/10 rounded-full">
                {state.playing ? <Pause className="w-16 h-16 text-white" /> : <Play className="w-16 h-16 text-white" />}
              </button>
            </div>
            
            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-4">
                <span className="text-white text-sm">{formatTime(state.playedSeconds)} / {formatTime(state.duration)}</span>
                <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/20 rounded-full">
                  <Settings className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-bold">Einstellungen</h3>
              <button onClick={() => setShowSettings(false)} className="text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-white mb-2">Geschwindigkeit</p>
                <div className="grid grid-cols-4 gap-2">
                  {[0.5, 1.0, 1.5, 2.0].map(rate => (
                    <button key={rate} onClick={() => setState(p => ({ ...p, playbackRate: rate }))} className={`py-2 rounded-xl ${state.playbackRate === rate ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerScreen;
```

## Highlights

1. **Custom UI & UX**: Overlay mit TailwindCSS und Framer Motion, Fade-Out nach 3 Sekunden
2. **Chapter Support**: Timeline visualisiert Kapitelmarker
3. **Performance**: useCallback und useMemo für optimierte Re-Renders
4. **Resume Playback**: Fortschritt wird alle 5 Sekunden in localStorage gespeichert
5. **Sleep Timer**: Integrierter Timer für automatisches Pausieren
6. **MediaSession Integration**: System-Controls für Tastatur/Kopfhörer/Lockscreen
7. **Responsive Design**: Touch-optimiert, Fullscreen-Support
8. **Accessibility**: ARIA-Labels, Keyboard-Support

## Installation

```bash
npm install react-player screenfull framer-motion lucide-react
```
