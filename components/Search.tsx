"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button2 from "@mui/material/Button";
import { useChat, Message } from "ai/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import search from "../public/arrow.svg";
import smallsearch from "../public/small-search.svg"
import cancel from "../public/cancel.svg";
import IconButton from "@mui/material/IconButton";
import { styled } from '@mui/material/styles';
import toast, { Toaster } from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";

const BASE_URL = "http://localhost:3004/api";

const Search: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [carMakes, setCarMakes] = useState<{ id: number; name: string }[]>([]);
  const [carModels, setCarModels] = useState<{ id: number; name: string }[]>([]);
  const [page, setPage] = useState(0);

  const yearInputRef = useRef<HTMLInputElement>(null);
  const makeInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const engineSizeInputRef = useRef<HTMLInputElement>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/makes`, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        if (data && Array.isArray(data.data)) {
          setCarMakes(data.data);
        } else {
          throw new Error("Fetched data does not contain an array in 'data' property");
        }
      } catch (e: any) {
        if (e.name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }

        console.error("Fetch error:", e);
        setError(e.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [page]);

  if (error) {
    return <div>Something went wrong! Please try again. Error: {error}</div>;
  }

  const [carMake, setCarMake] = React.useState<string>("");
  const [model, setModel] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");
  const [trim, setTrim] = React.useState<string>("");
  const [engineSize, setEngineSize] = React.useState<string>("");
  const [selectedButton, setSelectedButton] = React.useState<string | null>(null);
  const [shouldSubmit, setShouldSubmit] = React.useState<boolean>(false);
  const { input, handleInputChange, handleSubmit, messages, setInput } = useChat();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery("(max-width:1375px)");
  const isBigScreen = useMediaQuery("(min-width:1520px)");

  const years = Array.from({ length: 2024 - 1950 + 1 }, (_, index) => (1950 + index).toString());
  const engineSizes = ["1.0L", "1.2L", "1.5L", "1.6L", "1.8L", "2.0L", "2.2L", "2.4L", "3.0L", "3.5L", "4.0L"];

  const carDetails = `${selectedButton} for ${year} ${carMake} ${model} ${engineSize}`;

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

  const SmallIconButton = styled(IconButton)({
    fontSize: '1rem',
    padding: '0.5rem',
  });

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

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const submitForm = async () => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, carDetails }),
    });

    handleSubmit(new Event("submit"));
    setShouldSubmit(false);
  };

  React.useEffect(() => {
    if (shouldSubmit) {
      submitForm();
    }
  }, [shouldSubmit]);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedButton) {
      toast.error("Select a Car Part");
      return;
    }

    setInput(`${carDetails}`);
    setShouldSubmit(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(new Event("submit"));
    }
  };

  useEffect(() => {
    const fetchCarModels = async () => {
      if (carMake && year) {
        setIsLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/models?year=${year}&make=${carMake}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Fetched models data:", data);

          if (data && Array.isArray(data.data)) {
            setCarModels(data.data);
          } else {
            throw new Error("Fetched data does not contain an array in 'data' property");
          }
        } catch (e: any) {
          console.error("Fetch error:", e);
          setError(e.message || "Something went wrong");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCarModels();
  }, [carMake, year]);

  return (
    <div className="min-h-[100vh] flex flex-col">
      <Toaster />
      <section className="flex-grow flex flex-col py-2 lg:mb-5 lg:py-4 xl:mb-10">
        <form className="mt-4 flex flex-col items-center w-full" onSubmit={handleFormSubmit}>
          <div className="flex flex-wrap w-full">
            <div style={{ display: "flex", flexDirection: "column", margin: "1rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <Autocomplete
                  freeSolo
                  options={years}
                  value={year}
                  onChange={(event, newValue) => {
                    setYear(newValue || "");
                    if (years.includes(newValue || "")) {
                      makeInputRef.current?.focus();
                    }
                  }}
                  inputValue={year}
                  onInputChange={(event, newInputValue) => {
                    setYear(newInputValue);
                    if (years.includes(newInputValue)) {
                      makeInputRef.current?.focus();
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      helperText="Year of Car"
                      label="Year"
                      size="small"
                      style={{ margin: "0.5rem", width: "13ch" }}
                      inputRef={yearInputRef}
                    />
                  )}
                />
                <Autocomplete
                  freeSolo
                  options={carMakes.map(make => make.name)}
                  value={carMake}
                  onChange={(event, newValue) => {
                    setCarMake(newValue || "");
                    if (carMakes.some(make => make.name === newValue)) {
                      modelInputRef.current?.focus();
                    }
                  }}
                  inputValue={carMake}
                  onInputChange={(event, newInputValue) => {
                    setCarMake(newInputValue);
                    const matchingMakes = carMakes.filter(make => make.name.toLowerCase().startsWith(newInputValue.toLowerCase()));
                    if (matchingMakes.length === 1) {
                      setCarMake(matchingMakes[0].name);
                      modelInputRef.current?.focus();
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      helperText="Car Make"
                      label="Car Make"
                      size="small"
                      style={{ margin: "0.5rem", width: "13ch" }}
                      inputRef={makeInputRef}
                    />
                  )}
                />
                <Autocomplete
                  freeSolo
                  options={carModels.map(m => m.name)}
                  value={model}
                  onChange={(event, newValue) => {
                    setModel(newValue || "");
                    if (carModels.some(m => m.name === newValue)) {
                      engineSizeInputRef.current?.focus();
                    }
                  }}
                  inputValue={model}
                  onInputChange={(event, newInputValue) => {
                    setModel(newInputValue);
                    const matchingModels = carModels.filter(m => m.name.toLowerCase().startsWith(newInputValue.toLowerCase()));
                    if (matchingModels.length === 1) {
                      setModel(matchingModels[0].name);
                      engineSizeInputRef.current?.focus();
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      helperText="Model of Car"
                      label="Model"
                      size="small"
                      style={{ margin: "0.5rem", width: "13ch" }}
                      inputRef={modelInputRef}
                    />
                  )}
                />
                <Autocomplete
                  freeSolo
                  options={engineSizes}
                  value={engineSize}
                  onChange={(event, newValue) => {
                    setEngineSize(newValue || "");
                  }}
                  inputValue={engineSize}
                  onInputChange={(event, newInputValue) => {
                    setEngineSize(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      helperText="(Optional)"
                      id="outlined-basic"
                      label="Engine Size"
                      variant="outlined"
                      size="small"
                      style={{ margin: "0.5rem", width: "13ch" }}
                      inputRef={engineSizeInputRef}
                    />
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <SmallIconButton type="submit">
                  <Image src={smallsearch} alt="search" width={12} height={12} style={{ marginRight: '8px' }}/>
                  Search
                </SmallIconButton>
                <SmallIconButton onClick={() => {
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

        <div className={`flex-grow mt-4 flex flex-col items-center w-full overflow-y-auto ${isBigScreen ? 'max-h-[690px]' : 'max-h-[500px]'}`}>
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

        <form className="mt-4 w-full flex-none flex items-center justify-center" onSubmit={handleSubmit}>
          <textarea
            className="w-full h-12 bg-white p-2 rounded-md text-black border border-gray-300 focus:border-gray-700 focus:outline-none resize-none"
            placeholder="Message VeerAI"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <IconButton type="submit" className="ml-2">
            <Image src={search} alt="search" width={30} height={30} />
          </IconButton>
        </form>
        
      </section>
    </div>
  );
};

export default Search;
