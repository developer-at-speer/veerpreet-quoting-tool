"use client";
import React, { useEffect, useState } from 'react';

const ParseExcel: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error('Error fetching the Excel data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {jsonData ? (
        <pre>{JSON.stringify(jsonData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ParseExcel;
