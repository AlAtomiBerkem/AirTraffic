import React from "react";
import FlightSchedule from "../feature/FlightSchedule/ui/FlightSchedule";
import './styles/index.css'
import BackgroundScreen from "../widgets/BackgroundScreen/ui/BackgroundScreen"

function App() {
  return (
    <BackgroundScreen>
      <div className="App">
        <FlightSchedule />
      </div>
    </BackgroundScreen>
  );
}

export default App;