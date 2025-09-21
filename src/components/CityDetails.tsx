
import { useEffect, useState } from "react";

interface CityDetailsProps {
  cityId: number;
  cityName: string;
}

interface Forecast {
  dt: number;
  temp: number;
  weather: { icon: string; description: string }[];
}

export default function CityDetails({ cityId, cityName }: CityDetailsProps) {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!API_KEY) {
      setError("API-nyckel saknas (VITE_OPENWEATHER_API_KEY).");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    
    fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_KEY}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Coord-anrop misslyckades: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const lat = data?.coord?.lat;
        const lon = data?.coord?.lon;
        if (lat == null || lon == null) throw new Error("Koordinater saknas i svaret.");

        
        return fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&lang=se&appid=${API_KEY}`
        );
      })
      .then((res) => {
        if (!res.ok) throw new Error(`OneCall-anrop misslyckades: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setWeather(data?.current ?? null);
        const hours = Array.isArray(data?.hourly) ? data.hourly.slice(0, 48) : [];
        setForecast(hours);
      })
      .catch((err: any) => {
        console.error("CityDetails fetch error:", err);
        setError(String(err.message ?? err));
      })
      .finally(() => setLoading(false));
  }, [cityId]);

  if (loading) return <p>Laddar väder…</p>;
  if (error) return <p>Fel: {error}</p>;
  if (!weather) return <p>Ingen data att visa</p>;

  return (
    <>
      <h2>{cityName}</h2>
      <p>Temperatur: {Math.round(weather.temp)}°C</p>
      <p>Vind: {weather.wind_speed} m/s</p>
      <p>Fuktighet: {weather.humidity}%</p>

      <h3>Forecast (idag + imorgon)</h3>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "8px 0" }}>
        {forecast.map((hour) => (
          <div key={hour.dt} style={{ minWidth: 80, textAlign: "center" }}>
            <div>{new Date(hour.dt * 1000).getHours()}:00</div>
            <img
              src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
              alt={hour.weather[0].description}
              style={{ width: 48, height: 48 }}
            />
            <div>{Math.round(hour.temp)}°C</div>
          </div>
        ))}
      </div>
    </>
  );
}

