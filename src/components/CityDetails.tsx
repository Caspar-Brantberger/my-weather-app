import {useEffect, useState} from "react";

interface CityDetailsProps {
  cityId: number;
  cityName: string;
}

interface Forecast {
    dt: number;
    temp: number;
    weather: { icon: string; description: string }[];
}

export default function CityDetails({ cityId,cityName}: CityDetailsProps) {
    const [weather.setWeather] = useState<any>(null);
    const [forecastData, setForecastData] = useState<Forecast[]>([]);
}