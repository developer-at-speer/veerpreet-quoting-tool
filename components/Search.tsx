"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Button from './Button';
import Button2 from '@mui/material/Button';
import {useChat} from "ai/react"

const Search: React.FC = () => {
  const [part, setPart] = React.useState<string>('');
  const [carMake, setCarMake] = React.useState<string>('');
  const [model, setModel] = React.useState<string>('');
  const [year, setYear] = React.useState<string>('');
  const [engineSize, setEngineSize] = React.useState<string>('');
  const {input, handleInputChange, handleSubmit, isLoading, messages } = useChat();

  const handleChange = (event: SelectChangeEvent) => {
    setPart(event.target.value as string);
  };

  const handleClear = () => {
    setPart('');
    setCarMake('');
    setModel('');
    setYear('');
    setEngineSize('');
  };

  return (
    <section className="2xl:max-container items-center relative flex flex-col py-2 lg:mb-5 lg:py-4 xl:mb-10">
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

      <div className="my-6 flex flex-wrap gap-2">
        <div className="flex flex-col w-full gap-16 sm:flex-row">
          <Button
            type="button"
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
      </div>
    </section>
  );
};

export default Search;
