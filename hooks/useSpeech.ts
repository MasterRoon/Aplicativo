import { useEffect, useRef, useCallback } from 'react';
import * as Speech from 'expo-speech';
import { useSettingsStore } from '@/stores/settingsStore';

export function useSpeech() {
  const { speechRate } = useSettingsStore();
  const isSpeakingRef = useRef(false);
  
  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (isSpeakingRef.current) {
        Speech.stop();
      }
    };
  }, []);
  
  const speak = useCallback((text: string, onDone?: () => void) => {
    // Stop any current speech
    if (isSpeakingRef.current) {
      Speech.stop();
    }
    
    const options = {
      language: 'pt-BR',
      pitch: 1.0,
      rate: speechRate,
      onDone: () => {
        isSpeakingRef.current = false;
        onDone?.();
      },
      onError: (error: any) => {
        console.error('Speech error:', error);
        isSpeakingRef.current = false;
        onDone?.();
      }
    };
    
    isSpeakingRef.current = true;
    Speech.speak(text, options);
  }, [speechRate]);
  
  const stop = useCallback(() => {
    if (isSpeakingRef.current) {
      Speech.stop();
      isSpeakingRef.current = false;
    }
  }, []);
  
  return { speak, stop, isSpeaking: isSpeakingRef.current };
}