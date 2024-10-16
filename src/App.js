import React, { useEffect, useState } from "react";
import TravelSmart from "./components/TravelSmart";
import TripsPage from "./components/Trips";
import LoginForm from "./components/login";
import { AuthProvider } from "./components/contexts/AuthContext";
import Signup from "./components/registrationForm";
import PlaceContent from "./components/PlaceContent";
import TripPlanner from "./components/Planner";
import Results from "./components/filteredResults";
import Plan from "./components/Plan"
import PlacePage from "./components/PlacePage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Landing from "./components/Landing";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="place" element={<PlacePage />} />
              <Route path="trips" element={<TripsPage />}></Route>
              <Route path="home" element={<TravelSmart />} />
              <Route path="plan" element={<Plan />}></Route>
              <Route path="login" element={<LoginForm />}></Route>
              <Route path="signup" element={<Signup />}></Route>
              <Route path="Search-Results" element={<Results />}></Route>
              <Route path="MyTrip" element={<TripPlanner />}></Route>
              <Route path="/" element={<Landing />}></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
export default App;
