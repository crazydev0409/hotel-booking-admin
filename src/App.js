import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import SignIn from "./Screen/SignIn";
import Dashboard from "./Screen/Dashboard";
import AddHotelComponent from "./components/AddHotelComponent";
import AddRoomComponent from "./components/AddRoomComponent";
import AddSpotComponent from "./components/AddSpotComponent";
import AddTicketComponent from "./components/AddTicketComponent";
import AllHotelComponent from "./components/AllHotelComponent";
import AllSpotComponent from "./components/AllSpotComponent";
function Home() {
  let navigate = useNavigate();
  useEffect(() => {
    navigate("/signin");
  }, [navigate]);

  return null;
}

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="add_hotel/:_id" element={<AddHotelComponent />} />
            <Route path="add_room/:_id" element={<AddRoomComponent />} />
            <Route path="add_spot/:_id" element={<AddSpotComponent />} />
            <Route path="add_ticket/:_id" element={<AddTicketComponent />} />
            <Route path="add_hotel" element={<AddHotelComponent />} />
            <Route path="add_room" element={<AddRoomComponent />} />
            <Route path="add_spot" element={<AddSpotComponent />} />
            <Route path="add_ticket" element={<AddTicketComponent />} />
            <Route path="all_hotels" element={<AllHotelComponent />} />
            <Route path="all_spots" element={<AllSpotComponent />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
