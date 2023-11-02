import "./App.css";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import City from "./components/City";
import Form from "./components/Form";

import { useState, useEffect } from "react";
import CountriesList from "./components/CountriesList";
const BASE_URL = "http://localhost:8000";
function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        console.info(data);
        setCities(data);
      } catch {
        alert("something went wrong with the api call for city");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />}></Route>
        <Route path="/pricing" element={<Pricing />}></Route>
        <Route path="/product" element={<Product />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="app" element={<AppLayout />}>
          <Route
            index
            element={<Navigate replace to="cities"></Navigate>}
          ></Route>
          <Route
            path="cities"
            element={
              <CityList cities={cities} isLoading={isLoading}></CityList>
            }
          ></Route>
          <Route path="cities/:id" element={<City />}></Route>
          <Route
            path="countries"
            element={
              <CountriesList
                cities={cities}
                isLoading={isLoading}
              ></CountriesList>
            }
          ></Route>
          <Route path="form" element={<Form></Form>}></Route>
        </Route>
        +<Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
