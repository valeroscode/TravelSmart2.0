import React from "react";
import TravelSmart from "./components/TravelSmart";
import TripsPage from "./components/Trips";
import LoginForm from "./components/login";
import { AuthProvider } from "./components/contexts/AuthContext";
import Signup from "./components/registrationForm";
import PlaceContent from "./components/PlaceContent";
import TripPlanner from "./components/Planner";
import Results from "./components/filteredResults";
import { HashRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <AuthProvider>
        <HashRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<LoginForm />}></Route>
              <Route path="place" element={<PlaceContent />} />
              <Route path="Home" element={<TravelSmart />} />
              <Route path="trips" element={<TripsPage />} />
              <Route path="login" element={<LoginForm />}></Route>
              <Route path="signup" element={<Signup />}></Route>
              <Route path="Search-Results" element={<Results />}></Route>
              <Route path="MyTrip" element={<TripPlanner />}></Route>
            </Routes>
          </div>
        </HashRouter>
      </AuthProvider>
    </>
  );
}
export default App;
