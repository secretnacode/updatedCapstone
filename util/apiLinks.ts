import { weatherBaseLinkParameterType } from "@/types";

/**
 * base link of the weatherApi
 */
export const weatherApiBaseLink = `https://api.weatherapi.com/v1`;

export const weatherApiKey = (requestUrl: "current" | "forecast") =>
  `${weatherApiBaseLink}/${requestUrl}.json?key=${process.env.WEATHER_API_KEY}&`;

/**
 * end point of current(geting current weather) weather using weatherApi
 */
export const currentWeatherBaseLink = ({
  lat,
  lng,
}: weatherBaseLinkParameterType) =>
  `${weatherApiKey("current")}q=${lat},${lng}`;

/**
 * end point of forecast(geting future weather) weather using weatherApi
 *
 * it gives weather data today in each hour and for the next 2 days
 */
export const forcastWeatherBaseLink = ({
  lat,
  lng,
}: weatherBaseLinkParameterType) =>
  `${weatherApiKey("forecast")}q=${lat},${lng}&days=3&aqi=no&alerts=no`;
