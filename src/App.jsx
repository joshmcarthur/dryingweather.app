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
      className="w-6 h-6"
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
      className="w-6 h-6"
      viewBox="0 0 16 16"
    >
      <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
      <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
    </svg>
  ),
};

const EVENT_ICONS = {
  sunrise: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="w-8 h-8"
      viewBox="0 0 16 16"
    >
      <path d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7zm3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
    </svg>
  ),
  sunset: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="w-8 h-8"
      viewBox="0 0 16 16"
    >
      <path d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7zm3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
    </svg>
  ),
};

const HourlyEvent = ({ report: { event, time } }) => (
  <>
    <div className="flex w-full items-center p-6 space-x-6 border rounded-md shadow-sm hover:shadow-lg transform hover:scale-102 transition duration-500">
      <div className="flex text-blue-700">{EVENT_ICONS[event] && EVENT_ICONS[event]}</div>
      <div className="flex flex-1 font-bold text-l">{event.charAt(0).toUpperCase() + event.slice(1)}</div>
      <div className="flex ml-auto py-3 px-4 rounded-lg text-gray-500 text-xl font-semibold">
        {formatDate(new Date(time), "h:mmaaa")}
      </div>
    </div>
    <hr className="w-full border-dashed border-1" />
  </>
);

const HourlyReport = ({ report }) => {
  if (report.event !== "forecast") {
    return <HourlyEvent report={report} />;
  }

  const formattedTime = formatDate(new Date(report.time), "haaa");

  return (
    <div className="flex w-full items-center p-6 space-x-6 border rounded-md shadow-sm hover:shadow-lg transform hover:scale-102 transition duration-500">
      <div className="flex text-blue-700">
        {report.scores.overall > 0 ? <ConditionGreat className="w-8 h-8" /> : <ConditionPoor className="w-8 h-8" />}
      </div>
      <div className="flex flex-col flex-1">
        <div className="d-block font-bold text-l">
          {report.scores.overall > 0 ? "Good" : "Poor"} drying conditions at {formattedTime}
        </div>
        <div className="mb-2">
          <span className="font-bold text-sm">Dewpoint: </span>
          <span className="text-sm text-gray-500">{report.forecast.dewpoint.toPrecision(2)}°C</span>
          <span className="ml-2 font-bold text-sm">Humidity: </span>
          <span className="text-sm text-gray-500">{report.forecast.humidity * 100}%</span>
          <span className="ml-2 font-bold text-sm">Windspeed: </span>
          <span className="text-sm text-gray-500">{Math.round(report.forecast.windspeed)}km/h</span>
        </div>
        <div>
          {report.messages
            .filter((msg) => msg.type === "warning")
            .map((msg) => (
              <div key={msg.message} className="flex flex-row items-center py-1">
                <div className="text-sm font-small">{msg.message}</div>
              </div>
            ))}
        </div>
      </div>
      <div className="flex ml-auto py-3 px-4 rounded-lg text-gray-500 text-xl font-semibold">{formattedTime}</div>
    </div>
  );
};

function App() {
  const [location, setLocation] = useState();
  const [dryingConditions, setDryingConditions] = useState([]);
  const [current, setCurrent] = useState();
  const [positionMode, setPositionMode] = useState(cookies.get("position-mode") || "ip");

  useEffect(() => {
    const url = "https://dryingweather.joshmcarthur.workers.dev";
    const doFetch = (url) =>
      fetch(url)
        .then((r) => r.json())
        .then(({ location, dryingConditions }) => {
          setLocation(location);
          setDryingConditions(dryingConditions);
        });

    positionMode === "ip" && doFetch(url);
    positionMode === "device" &&
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => doFetch(`${url}?lat=${latitude}&lng=${longitude}`),
        () => setPositionMode("ip")
      );

    return;
  }, [positionMode]);

  useEffect(() => {
    if (!current) {
      return;
    }

    document.title = `Conditions are ${current.scores.overall > 0 ? "good" : "bad"} for drying in ${location.city}`;
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
    <div className="min-h-screen flex items-center md:items-start flex-col justify-center">
      <div className="flex flex-col md:flex-row items-center md:items-start w-full">
        <div className="flex flex-col md:sticky top-16 bg-white md:ml-16 rounded p-4 m-10 mb-0 md:m-0">
          {positionMode === "ip" && (
            <button
              onClick={() => setPositionMode("device")}
              className="appearance-none text-left text-blue-800 text-sm mb-1"
            >
              Use device location
            </button>
          )}
          {positionMode === "device" && (
            <button
              onClick={() => setPositionMode("ip")}
              className="appearance-none text-left text-blue-800 text-sm mb-1"
            >
              Use estimated location
            </button>
          )}
          <div className="font-bold text-xl">
            {positionMode === "ip" && (
              <>
                {location.city}, {location.country}
              </>
            )}
            {positionMode === "device" &&
              ((location.longitude && location.latitude && (
                <>
                  {location.latitude}, {location.longitude}
                </>
              )) ||
                "Waiting for location...")}
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
                {current && current.scores.overall > 0 ? "Good" : "Poor"} drying conditions now
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
              <div key={msg.message} className={`flex flex-row items-center py-2 ${idx === 0 ? "mt-6" : ""}`}>
                <div className="text-blue-700">
                  {MESSAGE_ICONS[msg.type] || <span className="w-6 h-6 block"></span>}
                </div>
                <div className="text-sm font-medium ml-3">{msg.message}</div>
              </div>
            ))}
          <div className="hidden md:block justify-self-end text-center w-full mt-10 mb-5 text-gray-500 text-xs">
            <a href="https://darksky.net/poweredby/">Powered by DarkSky</a>
            <br />
            Icons created by agusrahar from Noun Project
            <br />
            <a href="https://dryingweather.joshmcarthur.workers.dev">Fair-use API available</a>
            <br />
          </div>
        </div>
        <div className="mx-10 md:border-l-8 space-y-10 md:pl-10 pt-16 pb-16 border-blue-100 flex-1 flex-col flex items-center">
          {dryingConditions
            .filter((cond) => new Date().getDay() === new Date(cond.time).getDay())
            .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
            .map((cond, idx) => (
              <HourlyReport key={`condition-${idx}`} report={cond} />
            ))}
        </div>
      </div>
      <div className="md:hidden justify-self-end text-center w-full mt-10 mb-5 text-gray-500 text-xs">
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
