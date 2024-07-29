"use client";
import { useEffect, useRef, useState } from "react";

const BASE_URL = "http://localhost:3004/api/trims?year=2015&make=Toyota&model=Venza";

export default function Demo() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trims, setTrims] = useState<{ id: number; name: string; description: string; msrp: number; invoice: number }[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchTrims = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}`, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data to inspect its structure

        // Extract the array from the 'data' property
        if (data && Array.isArray(data.data)) {
          setTrims(data.data);
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

    fetchTrims();

    // Cleanup function to abort the fetch request when the component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (error) {
    return <div>Something went wrong! Please try again. Error: {error}</div>;
  }

  return (
    <div className="tutorial">
      <h1 className="mb-4 text-2xl">Car Trims</h1>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <ul>
          {trims.map((trim) => (
            <li key={trim.id}>
              {trim.description} 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
