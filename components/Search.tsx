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
import smallsearch from "../public/small-search.svg";
import cancel from "../public/cancel.svg";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import toast, { Toaster } from "react-hot-toast";
import Autocomplete from "@mui/material/Autocomplete";
import Collapse from "@mui/material/Collapse";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import { useChatContext } from "./ChatContext";

// Proxy Server for CarAPI
const BASE_URL = "https://vpsc-carapi.onrender.com/api";

const Search: React.FC = () => {
  // Destructuring fetchCarDetails and selectedCarDetail from the ChatContext.tsx
  const { fetchCarDetails, selectedCarDetail } = useChatContext();

  // State variables
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [carMakes, setCarMakes] = useState<{ id: number; name: string }[]>([]);
  const [carModels, setCarModels] = useState<{ id: number; name: string }[]>([]);
  const [carTrims, setCarTrims] = useState<{ id: number; name: string; description: string }[]>([]);
  const [carEngineSizes, setCarEngineSizes] = useState<{ id: number; size: number }[]>([]);
  const [page, setPage] = useState(0);
  const yearInputRef = useRef<HTMLInputElement>(null);
  const makeInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const trimInputRef = useRef<HTMLInputElement>(null);
  const engineSizeInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [carMake, setCarMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [trim, setTrim] = useState<string>("");
  const [engineSize, setEngineSize] = useState<string>("");
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);
  const { input, handleInputChange, handleSubmit, messages, setInput } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery("(max-width:1440px)");
  const isBigScreen = useMediaQuery("(min-width:1520px)");
  const years = Array.from({ length: 2024 - 1950 + 1 }, (_, index) => (1950 + index).toString());
  const [isCarDetailSet, setIsCarDetailSet] = useState<boolean>(false); // State variable, setting all the states to false
  const carDetails = `${year} ${carMake} ${model} ${trim} ${engineSize}`;

  // Fetches data from the API and sets the data in the state
  const fetchData = async (endpoint: string, setData: (data: any) => void) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint, { signal: abortControllerRef.current.signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data.data)) {
        setData(data.data);
      } else {
        throw new Error("Fetched data does not contain an array in 'data' property");
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.error("Fetch error:", e);
        setError(e.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch for car makes
  useEffect(() => {
    fetchData(`${BASE_URL}/makes`, setCarMakes);
  }, [page]);

  // Fetch car models based on selected make and year
  useEffect(() => {
    if (carMake && year) {
      fetchData(`${BASE_URL}/models?year=${year}&make=${carMake}`, setCarModels);
    }
  }, [carMake, year]);

  // Fetch car trims based on selected make, year, and model
  useEffect(() => {
    if (carMake && year && model) {
      fetchData(`${BASE_URL}/trims?year=${year}&make=${carMake}&model=${model}`, setCarTrims);
    }
  }, [carMake, year, model]);

  // Fetch engine sizes based on selected make, year, model, and trim
  useEffect(() => {
    if (carMake && year && model && trim) {
      fetchData(`${BASE_URL}/engines?year=${year}&make=${carMake}&model=${model}&trim=${trim}`, setCarEngineSizes);
    }
  }, [carMake, year, model, trim]);

  // Handles button click for car part selection
  const handleButtonClick = (buttonLabel: string) => {
    setSelectedButton(buttonLabel);
  };

  // Car part buttons
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

  // Styled icon button
  const SmallIconButton = styled(IconButton)({
    fontSize: "1rem",
    padding: "0.5rem",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  });

  // Renders the car part buttons
  const renderButtons = (group: number) => {
    return buttons
      .filter((button) => button.group === group)
      .map((button, index) => (
        <Grow in={true} key={index}>
          <Button2
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
        </Grow>
      ));
  };

  // Scrolls to the bottom of the chat log
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Submits the form and saves car details
  const submitForm = async () => {
    const response = await fetch("/api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ year, carMake, model, trim, engineSize }),
    });

    if (response.ok) {
      toast.success("Car details saved successfully");
    } else {
      toast.error("Failed to save car details");
    }

    await handleSubmit(new Event("submit"));
    setIsFormSubmitted(true);
    setShouldSubmit(false);

    // Call fetchCarDetails to update Sidebar
    fetchCarDetails();
  };

  // Save messages to database after form submission
  // useEffect(() => {
  //   const saveMessages = async () => {
  //     if (isFormSubmitted) {
  //       const messagesResponse = await fetch("/api/messages", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(messages),
  //       });

  //       if (messagesResponse.ok) {
  //         toast.success("Messages saved successfully");
  //       } else {
  //         toast.error("Failed to save messages");
  //       }

  //       setIsFormSubmitted(false);
  //     }
  //   };

  //   saveMessages();
  // }, [isFormSubmitted, messages]);

  useEffect(() => {
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
    const handleCarDetailsSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      const carDetails = customEvent.detail;
      setInput(carDetails);
      handleSubmit(new Event("submit"));
    };

    window.addEventListener("carDetailsSelected", handleCarDetailsSelected as EventListener);

    return () => {
      window.removeEventListener("carDetailsSelected", handleCarDetailsSelected as EventListener);
    };
  }, [handleSubmit, setInput]);

// Sets the input field and sets the state variable to true once input is set
useEffect(() => {
  if (selectedCarDetail) {
    setInput(selectedCarDetail);
    setIsCarDetailSet(true); // Set the state to true
  }
}, [selectedCarDetail, setInput]);

// Submits the form once the input field is updated with the car detail
useEffect(() => {
  if (isCarDetailSet) {
    handleSubmit(new Event("submit"));
    setIsCarDetailSet(false); // Reset the state variable
  }
}, [isCarDetailSet, handleSubmit]);

  return (
    <div className="min-h-[100vh] flex flex-col">
      <Toaster />
      <section className="flex-grow flex flex-col py-2 lg:mb-5 lg:py-4 xl:mb-10">
        <form className="mt-4 flex flex-col items-center w-full" onSubmit={handleFormSubmit}>
          <div className="flex flex-wrap w-full">
            <div style={{ display: "flex", flexDirection: "column", margin: "1rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {/* Year Text Input */}
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
                      style={{ margin: "0.5rem", width: "10ch", transition: "all 0.3s ease" }}
                      inputRef={yearInputRef}
                    />
                  )}
                />

                {/* Car Make Input */}
                <Autocomplete
                  freeSolo
                  options={carMakes.map((make) => make.name)}
                  value={carMake}
                  onChange={(event, newValue) => {
                    setCarMake(newValue || "");
                    if (!newValue) {
                      setModel("");
                      setTrim("");
                      setEngineSize("");
                    }
                    if (carMakes.some((make) => make.name === newValue)) {
                      modelInputRef.current?.focus();
                    }
                  }}
                  inputValue={carMake}
                  onInputChange={(event, newInputValue) => {
                    setCarMake(newInputValue);
                    if (!newInputValue) {
                      setModel("");
                      setTrim("");
                      setEngineSize("");
                    }
                    const matchingMakes = carMakes.filter((make) =>
                      make.name.toLowerCase().startsWith(newInputValue.toLowerCase())
                    );
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
                      style={{ margin: "0.5rem", width: "14ch", transition: "all 0.3s ease" }}
                      inputRef={makeInputRef}
                    />
                  )}
                />

                {/* Car Model Input */}
                <Autocomplete
                  freeSolo // Allow users to input values that are not options from the option list
                  options={carModels.map((m) => m.name)} // Fetches options from API
                  value={model} // Store in variable called model
                  onChange={(event, newValue) => {
                    setModel(newValue || ""); // Ensures the model starts off as an empty string, then keeps the state in sync with user input

                    // Clears the rest of the values to the left if model is cleared
                    if (!newValue) {
                      setTrim("");
                      setEngineSize("");
                    }

                    // Condition that checks if a car model from the options matches the users input
                    if (carModels.some((m) => m.name === newValue)) {
                      trimInputRef.current?.focus(); // If the condition is true, shifts to the next text input
                    }
                  }}
                  inputValue={model} // Value displayed in the input field

                  // Function that is called whenever the value of the input field is changed
                  onInputChange={(event, newInputValue) => {
                    setModel(newInputValue); // Setter function for the model variable
                    if (!newInputValue) {
                      setTrim("");
                      setEngineSize("");
                    }
                    const matchingModels = carModels.filter((m) =>
                      m.name.toLowerCase().startsWith(newInputValue.toLowerCase())
                    );

                    // Checks if there is a car model that matches the users input
                    if (matchingModels.length === 1) { // Checks if the users input value matches with exactly one car model
                      setModel(matchingModels[0].name); // Sets the model to the one matching model
                      trimInputRef.current?.focus(); // If the condition is true, shifts to the next text input
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      helperText="Model of Car"
                      label="Model"
                      size="small"
                      style={{ margin: "0.5rem", width: "12ch", transition: "all 0.3s ease" }}
                      inputRef={modelInputRef}
                    />
                  )}
                />

                {/* Car Trim Input */}
                <Autocomplete
                  freeSolo
                  options={Array.from(new Set(carTrims.map((t) => t.name)))} // Remove duplicates by converting to a Set and back to an array
                  value={trim}
                  onChange={(event, newValue) => {
                    setTrim(newValue || "");
                    if (!newValue) {
                      setEngineSize("");
                    }
                    if (carTrims.some((t) => t.name === newValue)) {
                      engineSizeInputRef.current?.focus();
                    }
                  }}
                  inputValue={trim}
                  onInputChange={(event, newInputValue) => {
                    setTrim(newInputValue);
                    if (!newInputValue) {
                      setEngineSize("");
                    }
                    const matchingTrims = carTrims.filter((t) =>
                      t.name.toLowerCase().startsWith(newInputValue.toLowerCase())
                    );
                    if (matchingTrims.length === 1) {
                      setTrim(matchingTrims[0].name);
                      engineSizeInputRef.current?.focus();
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      helperText="Trim of Model"
                      label="Trim"
                      size="small"
                      style={{ margin: "0.5rem", width: "12ch", transition: "all 0.3s ease" }}
                      inputRef={trimInputRef}
                    />
                  )}
                />

                {/* Car Engine Size Input */}
                <Autocomplete
                  freeSolo
                  options={Array.from(new Set(carEngineSizes.map((e) => `${e.size} L`)))}
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
                      label="Engine Size"
                      size="small"
                      style={{ margin: "0.5rem", width: "14ch", transition: "all 0.3s ease" }}
                      inputRef={engineSizeInputRef}
                    />
                  )}
                />

                <TextField
                  helperText = "(Optional)"
                  label ="Vin"
                  size = "small"
                  style={{ margin: "0.5rem", width: "14ch", transition: "all 0.3s ease" }}
                />
              </div>
            </div>

            {/* Car Part Buttons */}
            {isSmallScreen ? (
              <Box sx={{ m: 3, width: "110px", display: "flex", justifyContent: "center" }}>
                <Select
                  sx={{ width: "100%", height: "40px", transition: "all 0.3s ease" }}
                  fullWidth
                  value={selectedButton || ""}
                  onChange={(e) => setSelectedButton(e.target.value)}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: "#aaa" }}>Car Part</span>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="" disabled>
                    Car Part
                  </MenuItem>
                  {buttons.map((button, index) => (
                    <MenuItem key={index} value={button.label}>
                      {button.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", "& button": { m: 1, transition: "all 0.3s ease" } }}>
                <Box sx={{ display: "flex" }}>{renderButtons(1)}</Box>
                <Box sx={{ display: "flex" }}>{renderButtons(2)}</Box>
                <Box sx={{ display: "flex" }}>{renderButtons(3)}</Box>
              </Box>
            )}
          </div>

          {/* Search and Clear Buttons */}
          <div className="flex flex-wrap gap-3 justify-start pl-40 w-full">
            <SmallIconButton type="submit">
              <Image src={smallsearch} alt="search" width={12} height={12} style={{ marginRight: "8px" }} />
              Search
            </SmallIconButton>
            <SmallIconButton
              onClick={() => {
                setCarMake("");
                setModel("");
                setYear("");
                setEngineSize("");
                setTrim("");
                setSelectedButton(null);
              }}
            >
              <Image src={cancel} alt="cancel" width={12} height={12} style={{ marginRight: "4px" }} />
              Clear Vehicle
            </SmallIconButton>
          </div>
        </form>

        <div
          className={`flex-grow mt-4 flex flex-col items-center w-full overflow-y-auto ${
            isBigScreen ? "max-h-[690px]" : "max-h-[500px]"
          }`}
        >
          {messages.map((message: Message) => {
            const isAssistant = message.role === "assistant";

            return (
              <div
                key={message.id}
                className={`flex flex-col space-y-4 p-4 ${isAssistant ? "self-start" : "self-end"} max-w-2xl`}
              >
                <Fade in={true} timeout={500}>
                  <div className={`${isAssistant ? "bg-grey-10" : "bg-gray-200"} rounded-lg p-6 text-sm`}>
                    <h3 className={`${isAssistant ? "text-gray-700" : "text-gray-700"} font-semibold`}>
                      {isAssistant ? "VeerAI" : "You"}
                    </h3>
                    {message.content.split("\n").map((currentTextBlock: string, index: number) => (
                      <p key={message.id + index} className={`${isAssistant ? "text-gray-800" : "text-gray-800"}`}>
                        {currentTextBlock || <>&nbsp;</>}
                      </p>
                    ))}
                  </div>
                </Fade>
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
            disabled={isLoading}
            style={{ transition: "all 0.3s ease" }}
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
