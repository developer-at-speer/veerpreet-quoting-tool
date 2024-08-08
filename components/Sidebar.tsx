"use client";
import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import add from "../public/add.svg";
import deleteIcon from "../public/delete.svg";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { useChatContext } from './ChatContext';

const Sidebar: React.FC = () => {
  // The useChatContext hook is importing and accessing the context created in your ChatContext file, which provides the chats, setChats, fetchCarDetails, selectedCarDetail, and setSelectedCarDetail values to the Sidebar component from MongoDB
  const { chats, setChats, fetchCarDetails, setSelectedCarDetail } = useChatContext();

  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Function is not fully working, used to clear/refresh chat 
  const startNewChat = async () => {
    try {
      setChats([]);
      setActiveChat(null);
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
  };
 
  // Function used to call MongoDB to delete a car from the database
  const deleteChat = async (chat: string) => {
    // Extracts specific parts from the car details
    const match = chat.match(/^(\d{4})\s+(\w+)\s+([\w\s]+?)\s+([\d.]+ L)$/); // Year + Make + Model + Trim + Engine Size

    // Sees if it matches up with the format
    if (!match) {
      console.error("Invalid chat format:", chat);
      return;
    }

    const [, year, carMake, modelAndTrim, engineSize] = match;
    const [model, ...trimParts] = modelAndTrim.split(' ');
    const trim = trimParts.join(' ');

    const carDetails = { carMake, model, year, trim, engineSize };
 
    // API Call to delete car
    try {
      const response = await fetch('/api/cars', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carDetails),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Delete result:", result);

        setChats(prevChats => prevChats.filter(c => c !== chat));
        if (activeChat === chat) {
          setActiveChat(null);
        }
        setTimeout(() => {
          fetchCarDetails();
        }, 2000);
      } else {
        console.error("Failed to delete car");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };
 
  // Function to send car to API to retrive chat history of car
  const sendCarDetailsToAI = async (carDetails: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carDetails, messages: [] }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("OpenAI response:", result);
        // Handle the response as needed
      } else {
        console.error("Failed to send car details to OpenAI");
      }
    } catch (error) {
      console.error("Error sending car details to OpenAI:", error);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <p>Previous Chats</p>
        <IconButton type="submit" className="ml-2" onClick={startNewChat}>
          <Image src={add} alt="add" width={24} height={24} />
        </IconButton>
      </div>
      <div className={styles.chatList}>
        {/* Renders the different cars from MongoDB using ChatContext.tsx */}
        {/* Using ChatContext which allows componets to access the data from MongoDB, it fetches data from the DB and chats holds the list of the car details, which is rendered to the frontend. */}
        {chats.map((chat, index) => (
          <div key={index} className={styles.chatContainer}>
            <div
              className={`${styles.chatItem} ${chat === activeChat ? styles.activeChat : ''}`}
              onClick={() => {
                setActiveChat(chat);
                setSelectedCarDetail(chat); // Set the selected car detail in the context
                sendCarDetailsToAI(chat);
              }}
            >
              <span className={styles.chatText}>{chat}</span>
              <IconButton
                className={styles.deleteButton}
                onClick={() => deleteChat(chat)}
              >
                <Image src={deleteIcon} alt="delete" width={24} height={24} />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
