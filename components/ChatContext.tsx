"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Defines the values that will be provided 
interface ChatContextProps {
  chats: string[]; // Chat data containing car details 
  setChats: React.Dispatch<React.SetStateAction<string[]>>; // Updates the state of the chat 
  fetchCarDetails: () => Promise<void>; // Fetches car details from API
  selectedCarDetail: string | null; // State for the selected car detail
  setSelectedCarDetail: React.Dispatch<React.SetStateAction<string | null>>; // Updates the selected car detail
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<string[]>([]);
  const [selectedCarDetail, setSelectedCarDetail] = useState<string | null>(null);

  // Fetches car details from MongoDB. API call to /api/cars/route.ts
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
 
  // The useEffect hook is used to fetch data from API.
  useEffect(() => {
    fetchCarDetails(); // Fetch initial car details on component mount
  }, []);

  return (
    <ChatContext.Provider value={{ chats, setChats, fetchCarDetails, selectedCarDetail, setSelectedCarDetail }}>
      {children}
    </ChatContext.Provider>
  );
};
 // Allows components to access contents
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
