import React, { useEffect, useState } from "react";
import { format as formatDate } from "date-fns";
import ConditionPoor from "./ConditionPoor";
import ConditionGreat from "./ConditionGreat";
import poorIcon from "./poor.svg";
import greatIcon from "./great.svg";

const MESSAGE_ICONS = {
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="w-6 h-6"
      viewBox="0 0 16 16"
    >
      <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z" />
      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
    </svg>
  ),
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="w-6 h-6"
      viewBox="0 0 16 16"
    >
      <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
      <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
    </svg>
  ),
};

function App() {
  const [location, setLocation] = useState();
  const [dryingConditions, setDryingConditions] = useState([]);
  const [current, setCurrent] = useState();
  useEffect(
    () =>
      fetch("http://localhost:8787")
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

    document.title = `Conditions are ${current.scores.overall > 0 ? "suitable" : "unsuitable"} for drying laundry in ${location.city}`;
    document.getElementById("favicon").href = current.scores.overall > 0 ? greatIcon : poorIcon;
  }, [current, location]);

  useEffect(() => {
    if (!dryingConditions.length) {
      return;
    }
    const now = new Date();
    setCurrent(
      dryingConditions
        .filter((c) => c.event === "forecast")
        .reduce((acc, curr) => {
          return new Date(curr.time) < now ? curr : acc;
        })
    );
  }, [dryingConditions]);

  if (!dryingConditions.length) {
    return (
      <div className="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50">
        <span className="opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0" style={{ top: "50%" }}>
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center flex-col justify-center">
      <div className="flex flex-col bg-white border rounded p-4 w-full max-w-xs">
        <div className="font-bold text-xl">
          {location.city}, {location.country}
        </div>
        <div className="text-sm text-gray-500">
          at {current && formatDate(new Date(current.time), "d LLL yyyy haaa")}
        </div>
        <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-blue-700 h-24 w-24">
          {current && current.scores.overall > 0 ? (
            <ConditionGreat className="w-32 h-32" />
          ) : (
            <ConditionPoor className="w-32 h-32" />
          )}
        </div>
        <div className="flex flex-row items-center justify-center mt-6">
          <div className="flex flex-col items-center">
            <div className="text-3xl text-center">
              Conditions are {current && current.scores.overall > 0 ? "suitable" : "unsuitable"} for drying laundry
            </div>
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
        {current &&
          current.messages.map((msg, idx) => (
            <div class={`flex flex-row items-center py-2 ${idx === 0 ? "mt-6" : ""}`}>
              <div class="text-blue-700">{MESSAGE_ICONS[msg.type] || <span class="w-6 h-6 block"></span>}</div>
              <div class="text-sm font-medium ml-3">{msg.message}</div>
            </div>
          ))}
      </div>
      <div className="justify-self-end text-center mt-10 mb-5 text-gray-500 text-xs">
        <a href="https://darksky.net/poweredby/">Powered by DarkSky</a>
        <br />
        Icons created by agusrahar from Noun Project
        <br />
        <a href="https://dryingweather.joshmcarthur.workers.dev">Fair-use API available</a>
        <br />
      </div>
    </div>
  );
}

export default App;
