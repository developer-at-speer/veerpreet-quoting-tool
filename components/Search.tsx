"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button2 from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useChat, Message } from "ai/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";  
import search from "../public/arrow.svg";
import smallsearch from "../public/small-search.svg";
import cancel from "../public/cancel.svg";
import IconButton from "@mui/material/IconButton";
import { styled } from '@mui/material/styles';
import toast, { Toaster } from "react-hot-toast"; 

const Search: React.FC = () => {
  const [carMake, setCarMake] = React.useState<string>("");
  const [model, setModel] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");
  const [engineSize, setEngineSize] = React.useState<string>("");
  const [selectedButton, setSelectedButton] = React.useState<string | null>(null);
  const [shouldSubmit, setShouldSubmit] = React.useState<boolean>(false);
  const { input, handleInputChange, handleSubmit, messages, setInput } = useChat();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery("(max-width:1375px)");

  // Variable for car details
  const carDetails = `${selectedButton} for ${year} ${carMake} ${model} ${engineSize}`;

  // Handling car part buttons
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

  // Custom style button
  const SmallIconButton = styled(IconButton)({
    fontSize: '1rem', // Adjust the font size here
    padding: '0.5rem',   // Optionally adjust padding
  });

  // Renders car parts buttons
  const renderButtons = (group: number) => {
    return buttons
      .filter((button) => button.group === group)
      .map((button, index) => (
        <Button2
          key={index}
          variant="outlined"
          size="small"
          onClick={() => handleButtonClick(button.label)}
          sx={{
            m: 1,
            backgroundColor: selectedButton === button.label ? "#c7c7c7" : "#ededed",
            color: "grey",
            borderColor: selectedButton === button.label ? "#c7c7c7" : "#ededed",
            "&:hover": {
              borderColor: "#c7c7c7",
            },
          }}
        >
          {button.label}
        </Button2>
      ));
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handles submitting car details to backend from car text input box
  React.useEffect(() => {
    const submitForm = async () => {
      if (shouldSubmit) {
        // Perform the additional POST request to the backend
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages, carDetails }),
        });

        // Call the existing handleSubmit function
        handleSubmit(new Event("submit"));
        setShouldSubmit(false);
      }
    };

    submitForm();
  }, [shouldSubmit, carDetails, handleSubmit, messages]);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedButton) {
      toast.error("Select a Car Part");
      return;
    }

    // Update the input state with car details and set flag to submit form
    setInput(`${carDetails}`);
    setShouldSubmit(true);
  };

  // Submits inputs when Enter key is pressed
  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(new Event("submit"));
    }
  };

  return (
    <div className="min-h-[100vh] flex flex-col">
      <Toaster />
      <section className="flex-grow items-center relative flex flex-col py-2 lg:mb-5 lg:py-4 xl:mb-10">
        <form className="mt-4 flex flex-col items-center w-full" onSubmit={handleFormSubmit}>
          <div className="flex flex-wrap w-full">
            <div style={{ display: "flex", flexDirection: "column", margin: "1rem" }}>
              <div>
                <TextField
                  required
                  helperText="Car Make"
                  id="outlined-required"
                  label="Car Make"
                  value={carMake}
                  onChange={(e) => setCarMake(e.target.value)}
                  size="small"
                  style={{ margin: "0.5rem", width: "13ch" }}
                />
                <TextField
                  required
                  helperText="Model of Car"
                  id="outlined-required"
                  label="Model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  size="small"
                  style={{ margin: "0.5rem", width: "13ch" }}
                />
                <TextField
                  required
                  helperText="Year of Car"
                  id="outlined-required"
                  label="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  size="small"
                  style={{ margin: "0.5rem", width: "13ch" }}
                />
                <TextField
                  helperText="(Optional)"
                  id="outlined-basic"
                  label="Engine Size"
                  variant="outlined"
                  value={engineSize}
                  onChange={(e) => setEngineSize(e.target.value)}
                  size="small"
                  style={{ margin: "0.5rem", width: "13ch" }}
                />
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <SmallIconButton type="submit">
                  <Image src={smallsearch} alt="search" width={12} height={12} style={{ marginRight: '6px' }}/>
                  Search
                </SmallIconButton>
                <SmallIconButton onClick = {() => {
                    setCarMake("");
                    setModel("");
                    setYear("");
                    setEngineSize("");
                    setSelectedButton(null);
                  }}>
                  <Image src={cancel} alt="cancel" width={12} height={12} style={{ marginRight: '4px' }}/>
                  Clear Vehicle
                </SmallIconButton>
              </div>
            </div>

            {isSmallScreen ? (
              <Box sx={{ m: 1, width: "100%", display: "flex", justifyContent: "center" }}>
                <Select
                  sx={{ width: "250px" }}
                  fullWidth
                  value={selectedButton || ""}
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
              <Box sx={{ display: "flex", flexDirection: "column", "& button": { m: 1 } }}>
                <Box sx={{ display: "flex" }}>{renderButtons(1)}</Box>
                <Box sx={{ display: "flex" }}>{renderButtons(2)}</Box>
                <Box sx={{ display: "flex" }}>{renderButtons(3)}</Box>
              </Box>
            )}
          </div>
        </form>

        <div className="mt-4 flex flex-col items-center w-full max-h-[400px] overflow-y-auto">
          {messages.map((message: Message) => {
            const isAssistant = message.role === "assistant";

            return (
              <div
                key={message.id}
                className={`flex flex-col space-y-4 p-4 ${isAssistant ? "self-start" : "self-end"} max-w-2xl`}
              >
                <div className={`${isAssistant ? "bg-blue-200" : "bg-gray-200"} rounded-lg p-6 text-sm`}>
                  <h3 className={`${isAssistant ? "text-blue-700" : "text-gray-700"} font-semibold`}>
                    {isAssistant ? "VeerAI" : "You"}
                  </h3>
                  {message.content.split("\n").map((currentTextBlock: string, index: number) => (
                    <p key={message.id + index} className={`${isAssistant ? "text-blue-800" : "text-gray-800"}`}>
                      {currentTextBlock || <>&nbsp;</>}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form className="mt-4 flex flex-col items-center w-full" onSubmit={handleSubmit}>
          <div className="w-full flex items-center justify-center">
            <textarea
              className="w-4/5 h-12 bg-white p-2 rounded-md text-black border border-gray-300 focus:border-gray-700 focus:outline-none resize-none"
              placeholder="Message VeerAI"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <IconButton type="submit" className="ml-2">
              <Image src={search} alt="search" width={30} height={30} />
            </IconButton>
          </div>
        </form>
        
      </section>
    </div>
  );
};

export default Search;
