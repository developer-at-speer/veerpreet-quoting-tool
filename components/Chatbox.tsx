import React, { useState } from 'react';

const ChatComponent = () => {
  const [inputs, setInputs] = useState({
    input1: '',
    input2: '',
    input3: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Combine inputs into a single message or perform other logic
    const combinedMessage = `Input 1: ${inputs.input1}, Input 2: ${inputs.input2}, Input 3: ${inputs.input3}`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: combinedMessage }] }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        result += decoder.decode(value, { stream: true });
      }

      setMessages((prevMessages) => [...prevMessages, result]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);

      // Reset the inputs
      setInputs({
        input1: '',
        input2: '',
        input3: ''
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Input 1:
            <input
              type="text"
              name="input1"
              value={inputs.input1}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Input 2:
            <input
              type="text"
              name="input2"
              value={inputs.input2}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Input 3:
            <input
              type="text"
              name="input3"
              value={inputs.input3}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>Submit</button>
      </form>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatComponent;
