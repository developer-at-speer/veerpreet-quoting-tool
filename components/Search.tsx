"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from './Button';
import Button2 from '@mui/material/Button';
import {useChat, Message} from "ai/react";

const Search: React.FC = () => {
  const [part, setPart] = React.useState<string>('');
  const [carMake, setCarMake] = React.useState<string>('');
  const [model, setModel] = React.useState<string>('');
  const [year, setYear] = React.useState<string>('');
  const [engineSize, setEngineSize] = React.useState<string>('');
  const [selectedButton, setSelectedButton] = React.useState<string | null>(null);
  const {input, handleInputChange, handleSubmit, isLoading, messages} = useChat();

  // Function thatn handles the clear button
  const handleClear = () => {
    setPart('');
    setCarMake('');
    setModel('');
    setYear('');
    setEngineSize('');
  };

  // Handles the state when a button is selected
  const handleButtonClick = (buttonLabel: string) => {
    setSelectedButton(buttonLabel);
  };


  // Initializng the different car part buttons
  const buttons = [
    { label: "Oil Change", group: 1 },
    { label: "Tire Change", group: 1 },
    { label: "Air Filter", group: 1 },
    { label: "Cabin Filter", group: 1 },
    { label: "Battery", group: 2 },
    { label: "Wipers", group: 2 },
    { label: "Headlight Bulb", group: 2 },
    { label: "Signal Bulb", group: 2 },
    { label: "Brake Light Bulb", group: 3 },
    { label: "Brake Job", group: 3 },
    { label: "New Tire", group: 3 },
    { label: "A/C Refill", group: 3 },
  ];

  // Renders the button (Look more into this function)
  const renderButtons = (group: number) => {
    return buttons
      .filter(button => button.group === group)
      .map((button, index) => (
        <Button2
          key={index}
          variant="outlined"
          size="small"
          onClick={() => handleButtonClick(button.label)}
          sx={{
            m: 1,
            backgroundColor: selectedButton === button.label ? '#c7c7c7' : '#ededed',
            color: 'grey',
            borderColor: selectedButton === button.label ? '#c7c7c7' : '#ededed',
            '&:hover': {
              borderColor: '#c7c7c7',
            }
          }}
        >
          {button.label}
        </Button2>
      ));
  };

  return (
    <section className="2xl:max-container items-center relative flex flex-col py-2 lg:mb-5 lg:py-4 xl:mb-10">
      <div className="flex flex-wrap justify-between w-full">
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '15ch' } }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              required
              helperText="Enter the Car Make"
              id="outlined-required"
              label="Car Make"
              value={carMake}
              onChange={(e) => setCarMake(e.target.value)}
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
          </div>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', '& button': { m: 1 } }}>
          <Box sx={{ display: 'flex' }}>
            {renderButtons(1)}
          </Box>
          <Box sx={{ display: 'flex' }}>
            {renderButtons(2)}
          </Box>
          <Box sx={{ display: 'flex' }}>
            {renderButtons(3)}
          </Box>
        </Box>
      </div>

      <form className="mt-12 flex flex-col items-center" onSubmit={handleSubmit}>

        <textarea 
          className="mt-2 w-full bg-white p-2 rounded-md text-black border border-gray-300 focus:border-gray-700 focus:outline-none" 
          placeholder="Message VeerAI"
          value={input}
          onChange={handleInputChange}
        />

        <div className="my-6 flex flex-wrap gap-2 justify-center">
          {/* <button className="rounded-md bg-black p-2 mt-2 text-white">
            Send Message
          </button> */}

          <Button
            type="submit"
            title="Search"
            variant="btn_dark_green"
          />
          
          <Button
            type="button"
            title="Clear"
            variant="btn_dark_green"
            onClick={handleClear}
          />
        </div>

      </form>
      
      {/* <div className="my-6 flex flex-wrap gap-2 justify-center">
        <Button
          type="submit"
          title="Search"
          variant="btn_dark_green"
        />
        <Button
          type="button"
          title="Clear"
          variant="btn_dark_green"
          onClick={handleClear}
        />
      </div> */}

      {/* Oil Change Price and Details for 2019 Mercedes C300 4Matic 2.0L */}
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

export default Search;
