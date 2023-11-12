import "./App.css";
import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import CityList from "./components/CityList";
import City from "./components/City";
import Form from "./components/Form";
import CountriesList from "./components/CountriesList";

// import Homepage from "./pages/Homepage";
// import Pricing from "./pages/Pricing";
// import Product from "./pages/Product";
// import PageNotFound from "./pages/PageNotFound";
// import AppLayout from "./pages/AppLayout";
// import Login from "./pages/Login";

const Homepage = lazy(() => import("./pages/Homepage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Product = lazy(() => import("./pages/Product"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Login = lazy(() => import("./pages/Login"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
import ProtectedRoute from "./pages/ProtectedRoute";

//import { CitiesProvider } from "./contexts/CitiesContext";
import { CitiesProvider } from "./contexts/CitiesContextWithReducer";
import { AuthProvider } from "./contexts/FakeAuthContext";

import SpinnerFullPage from "./components/SpinnerFullPage";
function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />}></Route>
              <Route path="/pricing" element={<Pricing />}></Route>
              <Route path="/product" element={<Product />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={<Navigate replace to="cities"></Navigate>}
                ></Route>
                <Route path="cities" element={<CityList></CityList>}></Route>
                <Route path="cities/:id" element={<City />}></Route>
                <Route path="countries" element={<CountriesList />}></Route>
                <Route path="form" element={<Form></Form>}></Route>
              </Route>
              <Route path="*" element={<PageNotFound />}></Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
