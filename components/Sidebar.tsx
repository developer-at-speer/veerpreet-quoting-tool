"use client";
import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import add from "../public/add.svg";
import deleteIcon from "../public/delete.svg";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { useChatContext } from './ChatContext';

const Sidebar: React.FC = () => {
  const { chats, setChats, fetchCarDetails } = useChatContext();
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const startNewChat = async () => {
    try {
      setChats([]);
      setActiveChat(null);
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
  };

  const deleteChat = async (chat: string) => {
    const match = chat.match(/^(\d{4})\s+(\w+)\s+([\w\s]+)\s+([\w\s]+)\s+([\d.]+ L)$/);

    if (!match) {
      console.error("Invalid chat format:", chat);
      return;
    }

    const [, year, carMake, model, trim, engineSize] = match;
    const carDetails = { carMake, model, year, trim, engineSize };

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
        {chats.map((chat, index) => (
          <div key={index} className={styles.chatContainer}>
            <div
              className={`${styles.chatItem} ${chat === activeChat ? styles.activeChat : ''}`}
              onClick={() => {
                setActiveChat(chat);
                sendCarDetailsToAI(chat);
              }}
            >
              {chat}
            </div>
            <IconButton
              className={styles.deleteButton}
              onClick={() => deleteChat(chat)}
            >
              <Image src={deleteIcon} alt="delete" width={24} height={24} />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
