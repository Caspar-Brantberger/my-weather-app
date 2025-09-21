
import { useEffect, useState } from "react";

interface CityDetailsProps {
  cityId: number;
  cityName: string;
}

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: { icon: string; description: string }[];
}

export default function CityDetails({ cityId, cityName }: CityDetailsProps) {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
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

    
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${API_KEY}&units=metric&lang=se`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Prognos-anrop misslyckades: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setWeather(data?.list?.[0]?.main ?? null);
        const upcomingForecast = Array.isArray(data?.list)
          ? data.list.slice(0, 8)
          : [];
        setForecast(upcomingForecast);
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
      <h3>Prognos de närmsta 24 timmarna</h3>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "8px 0" }}>
        {forecast.map((item) => (
          <div key={item.dt} style={{ minWidth: 80, textAlign: "center" }}>
            <div>{new Date(item.dt * 1000).getHours()}:00</div>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
              style={{ width: 48, height: 48 }}
            />
            <div>{Math.round(item.main.temp)}°C</div>
          </div>
        ))}
      </div>
    </>
  );
}


