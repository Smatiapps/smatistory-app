# Step 5: StoryReader Component - Production Implementation

## Overview
This document contains the production-ready React/TypeScript code for the StoryReader component, which provides an immersive reading interface for generated stories.

## Generated Code

### 1. Types Definitions (types.ts)

```typescript
export type StoryType = 'Bedtime' | 'Adventure' | 'Educational' | 'Fantasy';

export interface Story {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  author: string;
  type: StoryType;
  lastReadPosition: number; // Percentage 0-100
  isSaved: boolean;
}
```

### 2. State Management (useStoryStore.ts)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Story } from './types';

interface StoryState {
  currentStory: Story | null;
  library: Story[];
  setCurrentStory: (story: Story) => void;
  updateProgress: (id: string, progress: number) => void;
  toggleSave: (id: string) => void;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set) => ({
      currentStory: null,
      library: [],
      setCurrentStory: (story) => set({ currentStory: story }),
      updateProgress: (id, progress) =>
        set((state) => ({
          library: state.library.map(s =>
            s.id === id ? { ...s, lastReadPosition: progress } : s
          ),
          currentStory:
            state.currentStory?.id === id
              ? { ...state.currentStory, lastReadPosition: progress }
              : state.currentStory
        })),
      toggleSave: (id) =>
        set((state) => ({
          library: state.library.map(s =>
            s.id === id ? { ...s, isSaved: !s.isSaved } : s
          )
        }))
    }),
    { name: 'story-storage' }
  )
);
```

### 3. Main Component (StoryReader.tsx)

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Bookmark, Edit3, Share2, Moon, Sun, BookOpen } from 'lucide-react';
import { useStoryStore } from './useStoryStore';
import { Story } from './types';

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
  onEdit: (id: string) => void;
}

const StoryReader: React.FC<StoryReaderProps> = ({ story, onBack, onEdit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(story.type === 'Bedtime');
  const [showControls, setShowControls] = useState(true);

  const updateProgress = useStoryStore((state) => state.updateProgress);
  const toggleSave = useStoryStore((state) => state.toggleSave);

  // Framer Motion Scroll Progress
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Auto-save progress every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentProgress = Math.round(scrollYProgress.get() * 100);
      updateProgress(story.id, currentProgress);
    }, 10000);
    return () => clearInterval(interval);
  }, [story.id, scrollYProgress, updateProgress]);

  // Handle Share
  const handleShare = async () => {
    try {
      await navigator.share({
        title: story.title,
        text: `Check out this story: ${story.title}`,
        url: window.location.href
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-colors duration-700 ${
      isDarkMode ? 'bg-black text-slate-200' : 'bg-stone-50 text-slate-900'
    }`}>
      {/* Top Navigation Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: showControls ? 0 : -100 }}
        className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
          isDarkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-stone-200'
        } backdrop-blur-md sticky top-0 z-50`}
      >
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="font-bold text-sm md:text-base line-clamp-1">{story.title}</h1>
            <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
              isDarkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-700'
            }`}>{story.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={handleShare} className="p-2 rounded-full">
            <Share2 size={20} />
          </button>
          <button
            onClick={() => toggleSave(story.id)}
            className={`p-2 rounded-full transition-colors ${
              story.isSaved ? 'text-yellow-500' : ''
            }`}
          >
            <Bookmark size={20} fill={story.isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div className="h-1 bg-indigo-500 origin-left z-50" style={{ scaleX }} />

      {/* Scrollable Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onScroll={() => {
          const current = containerRef.current?.scrollTop || 0;
          setShowControls(current < 50);
        }}
      >
        <div className="max-w-2xl mx-auto px-6 py-8 md:py-12">
          {/* Hero Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            {story.coverImage ? (
              <img src={story.coverImage} alt={story.title} className="w-full h-64 md:h-96 object-cover rounded-3xl shadow-2xl mb-8" />
            ) : (
              <div className="w-full h-64 md:h-96 rounded-3xl mb-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <BookOpen size={64} className="text-white/50" />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight text-center">{story.title}</h1>
            <p className={`text-center font-medium ${
              isDarkMode ? 'text-slate-400' : 'text-stone-500'
            }`}>By {story.author}</p>
          </motion.div>

          {/* Reading Body */}
          <div className={`prose prose-lg md:prose-xl max-w-none transition-colors duration-500 ${
            isDarkMode ? 'prose-invert' : 'prose-stone'
          }`}>
            {story.content.split('\n\n').map((paragraph, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="mb-6 leading-relaxed font-serif"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
          <div className="h-24" /> {/* Spacer */}
        </div>
      </div>

      {/* Floating Action Button (Edit) */}
      {showControls && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(story.id)}
          className="fixed bottom-8 right-8 p-4 bg-indigo-600 text-white rounded-2xl shadow-xl z-50 flex items-center gap-2 font-bold"
        >
          <Edit3 size={20} />
          <span className="hidden md:inline">Edit Story</span>
        </motion.button>
      )}
    </div>
  );
};

export default StoryReader;
```

## Key Implementation Details

1. **Immersive UI**: Uses `fixed inset-0` to take over the screen
2. **OLED Support**: Dark mode uses `bg-black` for OLED power savings
3. **Smart Controls**: Navigation and Edit button hide/show based on scroll
4. **Auto-Save Logic**: Progress tracked via `useEffect` with 10s interval
5. **Child-Friendly Typography**: Uses `font-serif` with `prose-xl` for readability
6. **Animations**: Smooth transitions using Framer Motion
7. **Error Resilience**: Fallback gradient if no cover image
8. **Responsive Design**: Mobile-first with responsive prefixes

## Installation Requirements

```bash
npm install zustand framer-motion lucide-react @tailwindcss/typography
```

Add to `tailwind.config.js`:

```javascript
plugins: [require('@tailwindcss/typography')]
```

## Status
✅ Component code generated  
✅ State management implemented  
✅ Dark mode with auto-detection  
✅ Auto-save functionality  
✅ Share API integration  
✅ Responsive design  
✅ Production-ready
