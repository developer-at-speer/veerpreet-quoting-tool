// components/ChatContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ChatContextProps {
  chats: string[];
  setChats: React.Dispatch<React.SetStateAction<string[]>>;
  fetchCarDetails: () => Promise<void>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<string[]>([]);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch('/api/cars');
      const data = await response.json();
      if (Array.isArray(data)) {
        const carNames = data.map((car: any) => `${car.year} ${car.carMake} ${car.model} ${car.trim} ${car.engineSize}`);
        setChats(carNames.reverse()); // Ensure the newest chats are added at the top
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  useEffect(() => {
    fetchCarDetails(); // Fetch initial car details on component mount
  }, []);

  return (
    <ChatContext.Provider value={{ chats, setChats, fetchCarDetails }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
