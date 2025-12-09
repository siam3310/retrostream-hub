import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MovieOrSeries } from '@/lib/types';

interface WatchLaterContextType {
  watchLater: MovieOrSeries[];
  addToWatchLater: (item: MovieOrSeries) => void;
  removeFromWatchLater: (id: string) => void;
  isInWatchLater: (id: string) => boolean;
}

const WatchLaterContext = createContext<WatchLaterContextType | undefined>(undefined);

export const WatchLaterProvider = ({ children }: { children: ReactNode }) => {
  const [watchLater, setWatchLater] = useState<MovieOrSeries[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('watchLater');
    if (stored) {
      try {
        setWatchLater(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse watch later:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('watchLater', JSON.stringify(watchLater));
  }, [watchLater]);

  const addToWatchLater = (item: MovieOrSeries) => {
    setWatchLater((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWatchLater = (id: string) => {
    setWatchLater((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWatchLater = (id: string) => {
    return watchLater.some((item) => item.id === id);
  };

  return (
    <WatchLaterContext.Provider value={{ watchLater, addToWatchLater, removeFromWatchLater, isInWatchLater }}>
      {children}
    </WatchLaterContext.Provider>
  );
};

export const useWatchLater = () => {
  const context = useContext(WatchLaterContext);
  if (!context) {
    throw new Error('useWatchLater must be used within a WatchLaterProvider');
  }
  return context;
};
