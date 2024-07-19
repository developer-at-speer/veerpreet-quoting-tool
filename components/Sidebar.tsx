"use client";
import React, { useState } from 'react';
import styles from './Sidebar.module.css'; // Import CSS module for styling

const Sidebar: React.FC = () => {
  const [chats, setChats] = useState<string[]>(['2022 Toyota Camry 2.0L', '2023 Tesla Model 3', '2023 Tesla Model Y']);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const startNewChat = () => {
    const newChat = `New Chat`;
    setChats([newChat, ...chats]);
    setActiveChat(newChat);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <button className={styles.newChatButton} onClick={startNewChat}>New Quote</button>
      </div>
      <div className={styles.chatList}>
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`${styles.chatItem} ${chat === activeChat ? styles.activeChat : ''}`}
            onClick={() => setActiveChat(chat)}
          >
            {chat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
