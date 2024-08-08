"use client";
import { useEffect, useRef, useState } from "react";

const BASE_URL = "http://localhost:3004/api/engines?year=2015&make=Toyota&model=Venza&trim=LE";

export default function Demo() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [engineSizes, setEngineSizes] = useState<{ id: number; size: number }[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchEngineSizes = async () => {
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
          setEngineSizes(data.data);
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

    fetchEngineSizes();

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
      <h1 className="mb-4 text-2xl">Car Engine Sizes</h1>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <ul>
          {engineSizes.map((engineSize) => (
            <li key={engineSize.id}>
              {engineSize.size} 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}