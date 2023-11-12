/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
const CitiesContext = createContext();
const BASE_URL = "http://localhost:8000";

export function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        console.info(data);
        setCities(data);
      } catch {
        console.error("something went wrong with the api call for city");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);
  const getCity = useCallback(
    async function getCity(id) {
      if (currentCity.id === id) return;
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await response.json();
        console.info(data);
        setCurrentCity(data);
      } catch {
        console.error("something went wrong with the api call for get city");
      } finally {
        setIsLoading(false);
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });

      const data = await response.json();
      setCities((oldCities) => [...oldCities, data]);
    } catch {
      console.error("something went wrong with the api call for get city");
    } finally {
      setIsLoading(false);
    }
  }
  async function deleteCity(id) {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      setCities((oldCities) => oldCities.filter((t) => t.id !== id));
    } catch {
      console.error("something went wrong with the api call for get city");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export function useCities() {
  const context = useContext(CitiesContext);
  if (context) return context;
  else throw new Error("Context used out of component bounds");
}
