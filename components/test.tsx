"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from './Button';
import {useChat, Message} from "ai/react";

const Test: React.FC = () => {
  const [carMake, setCarMake] = React.useState<string>('');
  const [model, setModel] = React.useState<string>('');
  const [year, setYear] = React.useState<string>('');
  const [engineSize, setEngineSize] = React.useState<string>('');
  const {input, handleInputChange, handleSubmit, isLoading, messages} = useChat();


  return (
    <section className="2xl:max-container items-center relative flex flex-col py-2 lg:mb-5 lg:py-4 xl:mb-10">
      <div className="flex flex-wrap justify-between w-full">

      <form className="mt-12 flex flex-col items-center" onSubmit={handleSubmit}>
          <div>
            <TextField
              required
              helperText="Enter the Car Make"
              id="outlined-required"
              label="Car Make"
              value={input}
              onChange={handleInputChange}
              size="small"
            />
            <TextField
              required
              helperText="Model of Car"
              id="outlined-required"
              label="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              size="small"
            />
            <TextField
              required
              helperText="Year of Car"
              id="outlined-required"
              label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              size="small"
            />
            <TextField
              helperText="(Optional)"
              id="outlined-basic"
              label="Engine Size"
              variant="outlined"
              value={engineSize}
              onChange={(e) => setEngineSize(e.target.value)}
              size="small"
            />
            <Button
              type="submit"
              title="Search"
              variant="btn_dark_green"
            />
            <TextField
                id="outlined-read-only-input"
                InputProps={{
                    readOnly: true,
                }}
                value={input}
                onChange={handleInputChange}
                size="small"
            />
          </div>
        </form>
      </div>

      {messages.map((message : Message) => {
        const isAssistant = message.role === "assistant";

        return (
          <div key={message.id} className={`flex flex-col space-y-4 p-4 ${isAssistant ? 'self-start' : 'self-end'} max-w-2xl`}>
            <div className={`${isAssistant ? 'bg-blue-200' : 'bg-gray-200'} rounded-lg p-6`}>
              <h3 className={`${isAssistant ? 'text-blue-700' : 'text-gray-700'} font-semibold`}>
                {isAssistant ? 'VeerAI' : 'You'}
              </h3>
              {message.content.split("\n").map((currentTextBlock: string, index : number) => (
                <p key={message.id + index} className={`${isAssistant ? 'text-blue-800' : 'text-gray-800'}`}>
                  {currentTextBlock || <>&nbsp;</>}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Test;
