/* eslint-disable react/prop-types */
import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";
const CitiesContext = createContext();
const BASE_URL = "http://localhost:8000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((t) => t.id !== action.payload),
        currentCity: {},
      };
    case "city/loaded":
      return {
        ...state,
        currentCity: action.payload,
      };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("Unknown action type.");
  }
}
export function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        console.info(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        console.error("something went wrong with the api call for city");
        dispatch({
          type: "error",
          payload: "something went wrong with the api call for city",
        });
      }
    }
    fetchCities();
  }, []);

  //here callback is used to memoize the function for the get city http calls
  const getCity = useCallback(
    async function getCity(id) {
      //no need to call the api for get city if the current city is clicked again
      if (Number(id) === currentCity.id) return;
      try {
        dispatch({ type: "loading" });
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await response.json();
        console.info(data);
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        console.error("something went wrong with the api call for get city");
        dispatch({
          type: "error",
          payload: "something went wrong with the api call for get city",
        });
      }
    },
    [currentCity.id]
  );
  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });

      const data = await response.json();
      dispatch({ type: "cities/created", payload: data });
    } catch {
      dispatch({
        type: "error",
        payload: "something went wrong with the api call for add city",
      });
    }
  }
  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      await response.json();
      dispatch({ type: "cities/created", payload: id });
    } catch {
      console.error("something went wrong with the api call for get city");
      dispatch({
        type: "error",
        payload: "something went wrong with the api call for delete city",
      });
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
        error,
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
