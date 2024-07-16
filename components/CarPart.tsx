"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function ButtonSizes() {
  // Stores variable of selected button
  const [selectedButton, setSelectedButton] = React.useState<string | null>(null);

  // Function that updates selectedButton variable
  const handleButtonClick = (buttonLabel: string) => {
    setSelectedButton(buttonLabel);
  };

  // Array of buttons
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

  // Renders the buttons
  const renderButtons = (group: number) => {
    return buttons
      .filter(button => button.group === group)
      .map((button, index) => (
        <Button
          key={index}
          variant="outlined"
          size="small"
          onClick={() => handleButtonClick(button.label)}
          sx={{
            m: 1,
            // If button is selected, changes color to dark grey
            backgroundColor: selectedButton === button.label ? '#c7c7c7' : '#ededed',
            color: 'grey',
            // Custom styling to remove the light blue border
            borderColor: selectedButton === button.label ? '#c7c7c7' : '#ededed',
            '&:hover': {
              borderColor: '#c7c7c7', // Maintain the same border color on hover
            }
          }}
        >
          {button.label}
        </Button>
      ));
  };

  return (
    <section className="2xl:max-container items-center relative flex flex-col py-2 lg:mb-5 lg:py-4 xl:mb-10">
      <Box sx={{ '& button': { m: 1 } }}>
        {renderButtons(1)}
      </Box>
      <Box sx={{ '& button': { m: 1 } }}>
        {renderButtons(2)}
      </Box>
      <Box sx={{ '& button': { m: 1 } }}>
        {renderButtons(3)}
      </Box>
    </section>
  );
}
