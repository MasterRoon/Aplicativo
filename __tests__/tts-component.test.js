import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useSpeech } from '../hooks/useSpeech';

// Mock Speech module
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
}));

// Mock the settings store
jest.mock('../stores/settingsStore', () => ({
  useSettingsStore: jest.fn(() => ({
    speechRate: 1.0,
  })),
}));

// Simple test component that uses the useSpeech hook
function TestComponent({ text }) {
  const { speak, stop, isSpeaking } = useSpeech();
  
  return (
    <>
      <button testID="speak-button" onPress={() => speak(text)}>Speak</button>
      <button testID="stop-button" onPress={stop}>Stop</button>
      <text testID="status">{isSpeaking ? 'Speaking' : 'Not speaking'}</text>
    </>
  );
}

describe('Text-to-Speech Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  test('Speaks when the speak button is pressed', async () => {
    const { getByTestId } = render(<TestComponent text="Hello, world!" />);
    
    const speakButton = getByTestId('speak-button');
    fireEvent.press(speakButton);
    
    // Check that Speech.speak was called with the right parameters
    const Speech = require('expo-speech');
    expect(Speech.speak).toHaveBeenCalledWith(
      'Hello, world!',
      expect.objectContaining({
        language: 'pt-BR',
        rate: 1.0,
      })
    );
  });
  
  test('Stops speaking when the stop button is pressed', async () => {
    const { getByTestId } = render(<TestComponent text="Hello, world!" />);
    
    // First speak something
    const speakButton = getByTestId('speak-button');
    fireEvent.press(speakButton);
    
    // Then stop it
    const stopButton = getByTestId('stop-button');
    fireEvent.press(stopButton);
    
    // Check that Speech.stop was called
    const Speech = require('expo-speech');
    expect(Speech.stop).toHaveBeenCalled();
  });
  
  test('Uses the correct speech rate from settings', async () => {
    // Override the mock to return a different speech rate
    require('../stores/settingsStore').useSettingsStore.mockReturnValue({
      speechRate: 2.0,
    });
    
    const { getByTestId } = render(<TestComponent text="Fast speech" />);
    
    const speakButton = getByTestId('speak-button');
    fireEvent.press(speakButton);
    
    // Check that Speech.speak was called with the updated rate
    const Speech = require('expo-speech');
    expect(Speech.speak).toHaveBeenCalledWith(
      'Fast speech',
      expect.objectContaining({
        rate: 2.0,
      })
    );
  });
});