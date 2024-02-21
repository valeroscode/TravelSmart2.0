import TravelSmart from "./components/TravelSmart";
import TripsPage from "./components/Trips";
import LoginForm from "./components/login";
import { AuthProvider } from "./components/contexts/AuthContext";
import Signup from "./components/registrationForm";
import PlaceContent from "./components/PlaceContent";
import TripPlanner from "./components/Planner";
import Results from "./components/filteredResults";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginForm />}></Route>
              <Route path="place" element={<PlaceContent />} />
              <Route exact path="Home" element={<TravelSmart />} />
              <Route path="trips" element={<TripsPage />} />
              <Route path="login" element={<LoginForm />}></Route>
              <Route path="signup" element={<Signup />}></Route>
              <Route path="Search-Results" element={<Results />}></Route>
              <Route path="MyTrip" element={<TripPlanner />}></Route>
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </>
  );
}
export default App;
