import React, { useEffect, useState } from "react";
import  { format as formatDate } from "date-fns";
import ConditionPoor from "./ConditionPoor";
import ConditionGreat from "./ConditionGreat";
import poorIcon from "./poor.svg";
import greatIcon from "./great.svg";

function App() {
  const [location, setLocation] = useState();
  const [dryingConditions, setDryingConditions] = useState([]);
  const [current, setCurrent] = useState();
  useEffect(
    () =>
      fetch("https://dryingweather.joshmcarthur.workers.dev")
        .then((r) => r.json())
        .then(({ location, dryingConditions }) => {
          setLocation(location);
          setDryingConditions(dryingConditions);
        }) && undefined,
    []
  );

  useEffect(() => {
    if (!current) {
      return;
    }

    document.title = `${current.scores.overall > 0 ? "Great" : "Poor"} drying conditions in ${location.city}`;
    document.getElementById("favicon").href = current.scores.overall > 0 ? greatIcon : poorIcon;
  }, [current, location])

  useEffect(() => {
    if (!dryingConditions.length) {
      return;
    }
    const now = new Date();
    setCurrent(dryingConditions.filter(c => c.event === "forecast").reduce((acc, curr) => {
      return (new Date(curr.time) < now ? curr : acc);
    }));
  }, [dryingConditions]);

  if (!dryingConditions.length) {
    return (
      <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50">
        <span className="opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0" style={{top: "50%"}}>
          Loading...
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center flex-col justify-center">
      <div className="flex flex-col bg-white border rounded p-4 w-full max-w-xs">
        <div className="font-bold text-xl">{location.city}, {location.country}</div>
        <div className="text-sm text-gray-500">at {current && formatDate(new Date(current.time), "d LLL yyyy haaa")}</div>
        <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-blue-700 h-24 w-24">
          {current && current.scores.overall > 0 ? <ConditionGreat className="w-32 h-32" /> : <ConditionPoor className="w-32 h-32" />}
        </div>
        <div className="flex flex-row items-center justify-center mt-6">
          <div className="flex flex-col items-center">
            <div className="text-4xl text-center">{current && current.scores.overall > 0 ? "Great" : "Poor"} drying conditions now</div>
          </div>
        </div>
        <div className="flex flex-row justify-between mt-6">
          <div className="flex flex-col items-center">
            <div className="font-bold text-sm">Dewpoint</div>
            <div className="text-sm text-gray-500">{current && current.forecast.dewpoint.toPrecision(2)}°C</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-bold text-sm">Humidity</div>
            <div className="text-sm text-gray-500">{current && current.forecast.humidity * 100}%</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="font-bold text-sm">Windspeed</div>
            <div className="text-sm text-gray-500">{current && Math.round(current.forecast.windspeed)}km/h</div>
          </div>
        </div>
      </div>
      <div className="justify-self-end text-center mt-10 mb-5 text-gray-500 text-xs">
        <a href="https://darksky.net/poweredby/">Powered by DarkSky</a>
        <br />
        Icons created by agusrahar from Noun Project
        <br />
        <a href="https://dryingweather.joshmcarthur.workers.dev">Fair-use API available</a><br />
      </div>
    </div>
  );
}

export default App;
