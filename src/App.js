import React from "react";
import TravelSmart from "./components/TravelSmart";
import TripsPage from "./components/Trips";
import LoginForm from "./components/login";
import { AuthProvider } from "./components/contexts/AuthContext";
import Signup from "./components/registrationForm";
import PlaceContent from "./components/PlaceContent";
import TripPlanner from "./components/Planner";
import Results from "./components/filteredResults";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Builder from "./builder";
import Landing from "./components/Landing";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="place" element={<PlaceContent />} />
              <Route path="Home" element={<TravelSmart />} />
              <Route path="login" element={<LoginForm />}></Route>
              <Route path="signup" element={<Signup />}></Route>
              <Route path="Search-Results" element={<Results />}></Route>
              <Route path="MyTrip" element={<TripPlanner />}></Route>
              <Route path="build" element={<Builder />}></Route>
              <Route path="/" element={<Landing />}></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
export default App;
