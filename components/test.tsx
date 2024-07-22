"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from './Button';
import Button2 from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useChat, Message } from "ai/react";
import useMediaQuery from '@mui/material/useMediaQuery';

const Search: React.FC = () => {
  const [selectedButton, setSelectedButton] = React.useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = React.useState<boolean>(false);

  // Define state for each input field
  const [carMake, setCarMake] = React.useState<string>("");
  const [carModel, setCarModel] = React.useState<string>("");
  const [carYear, setCarYear] = React.useState<string>("");
  const [engineSize, setEngineSize] = React.useState<string>("");

  const { messages, setInput, handleSubmit } = useChat();

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery('(max-width:1375px)');

  const handleButtonClick = (buttonLabel: string) => {
    setSelectedButton(buttonLabel);
  };

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

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    if (hasSubmitted) {
      scrollToBottom();
    }
  }, [messages, hasSubmitted]);

  // Handle change for each input field
  const handleCarMakeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCarMake(event.target.value);
  };

  const handleCarModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCarModel(event.target.value);
  };

  const handleCarYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCarYear(event.target.value);
  };

  const handleEngineSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEngineSize(event.target.value);
  };

  // Handle form submit
  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit(event);
    setHasSubmitted(true);
  };

  return (
    <div className="min-h-[100vh] flex flex-col">
      <section className="flex-grow items-center relative flex flex-col py-2 lg:mb-5 lg:py-4 xl:mb-10">
        <form className="mt-4 flex flex-col items-center w-full" onSubmit={onFormSubmit}>
          <div className="flex flex-wrap justify-between w-full">
            <Box
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
                  onChange={handleCarMakeChange}
                  size="small"
                />
                <TextField
                  required
                  helperText="Model of Car"
                  id="outlined-required"
                  label="Model"
                  value={carModel}
                  onChange={handleCarModelChange}
                  size="small"
                />
                <TextField
                  required
                  helperText="Year of Car"
                  id="outlined-required"
                  label="Year"
                  value={carYear}
                  onChange={handleCarYearChange}
                  size="small"
                />
                <TextField
                  helperText="(Optional)"
                  id="outlined-basic"
                  label="Engine Size"
                  variant="outlined"
                  value={engineSize}
                  onChange={handleEngineSizeChange}
                  size="small"
                />
              </div>
            </Box>

            {isSmallScreen ? (
              <Box sx={{ m: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Select
                  sx={{ width: '250px' }} 
                  fullWidth
                  value={selectedButton || ''}
                  onChange={(e) => setSelectedButton(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select a Car Part
                  </MenuItem>
                  {buttons.map((button, index) => (
                    <MenuItem key={index} value={button.label}>
                      {button.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            ) : (
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
            )}
          </div>

          <div className="my-6 flex flex-wrap gap-2 justify-center">
            <Button
              type="submit"
              title="Search"
              variant="btn_dark_green"
            />

            <Button
              type="button"
              title="Clear"
              variant="btn_dark_green"
            />
            
          </div>
        </form>

        <div className="mt-12 flex flex-col items-center w-full max-h-[600px] overflow-y-auto">
          {messages.map((message: Message) => {
            const isAssistant = message.role === "assistant";

            return (
              <div key={message.id} className={`flex flex-col space-y-4 p-4 ${isAssistant ? 'self-start' : 'self-end'} max-w-2xl`}>
                <div className={`${isAssistant ? 'bg-blue-200' : 'bg-gray-200'} rounded-lg p-6 text-sm`}>
                  <h3 className={`${isAssistant ? 'text-blue-700' : 'text-gray-700'} font-semibold`}>
                    {isAssistant ? 'VeerAI' : 'You'}
                  </h3>
                  {message.content.split("\n").map((currentTextBlock: string, index: number) => (
                    <p key={message.id + index} className={`${isAssistant ? 'text-blue-800' : 'text-gray-800'}`}>
                      {currentTextBlock || <>&nbsp;</>}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </section>
    </div>
  );
};

export default Search;
