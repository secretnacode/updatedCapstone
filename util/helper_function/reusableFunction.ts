import {
  barangayType,
  brangayWithCalauanType,
  getPointCoordinateReturnType,
  intoFeatureCollectionDataParam,
  NotificationBaseType,
} from "@/types";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { pointCoordinates, polygonCoordinates } from "./barangayCoordinates";
import {
  booleanPointInPolygon,
  featureCollection,
  point,
  polygon,
} from "@turf/turf";
import { Feature } from "geojson";
import { LngLatLike } from "maplibre-gl";
import { RefObject } from "react";
import { MapRef } from "@vis.gl/react-maplibre";
import {
  Cloud,
  CloudDrizzle,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudMoonRain,
  CloudRain,
  CloudRainWind,
  CloudSun,
  CloudSunRain,
  Cloudy,
  HelpCircle,
  LucideIcon,
  Moon,
  Sun,
} from "lucide-react";

/**
 * Generates a new UUID (Universally Unique Identifier).
 * @returns {string} A new UUID.
 */
export function CreateUUID(): string {
  return uuidv4();
}

/**
 * used if you want to get the current date
 * @returns current date with the format of YYMMDD eg. 2025-05-23
 */
export function CurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * a function that gets the date to day and is used for the inupt type date if you want the maximum date is today
 * @returns
 */
export function MaxDateToday(): string {
  return `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`;
}

/**
 * a function that returns a date
 * @returns date 4 days before
 */
export function FourDaysBefore(): string {
  let month = new Date().getMonth() + 1;
  let date = new Date().getDate() - 3;

  if (date <= 0) {
    if (month % 2 === 0) date += 30;
    else date += 31;
    month -= 1;
  }
  return `${new Date().getFullYear()}-${month
    .toString()
    .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
}

/**
 * if you want to convert the date that you want to pass into YYMMDD format date
 * @param date that you want to convery
 * @returns returns the date value(2025-35-35) that can be use in defaultValue of input date type
 */
export function DateToYYMMDD(date: Date) {
  return date.toISOString().split("T")[0];
}

/**
 * will be used in the validation of birthdate in farmer detail(after signing up)
 * @returns a date from 10 years ago
 */
export function Date10YearsAgo() {
  return new Date(
    `${new Date().getFullYear() - 10}-${new Date()
      .getMonth()
      .toString()
      .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`
  );
}

/**
 * transforming the date object into human readable date (e.g. Jul. 20, 2025)
 * @param date date type the you want to tranform
 * @returns human readable date
 */
export function ReadableDateFomat(date: Date) {
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const baranggayList = [
  "balayhangin",
  "bangyas",
  "dayap",
  "hanggan",
  "imok",
  "kanluran",
  "lamot 1",
  "lamot 2",
  "limao",
  "mabacan",
  "masiit",
  "paliparan",
  "perez",
  "prinza",
  "san isidro",
  "santo tomas",
  "silangan",
];

/**
 * used to redirect the user into login page with an error message
 * @param errorMessage params for the messsage of the error after redirecting to the login page and the type of its error
 * @returns redirect function with its message
 */
export const RedirectLoginWithError = (error: NotificationBaseType[]) => {
  return redirect(`/?error=${NotifToUriComponent(error)}`);
};

/**
 * encoding the notification param into an URI component
 * @param notif the message you want to encode
 * @returns encoded uri message
 */
export const NotifToUriComponent = (notif: NotificationBaseType[]) => {
  return encodeURIComponent(JSON.stringify(notif));
};

/**
 * @returns a value message for the log in again message
 */
export const LogInAgainMessage = (): string => {
  return "Nag expire na ang iyong pag lo-log in, mag log in ulit ng panibago";
};

/**
 * @returns a value mesage for the unexpected error message
 */
export const UnexpectedErrorMessage = (): string => {
  return "May hindi inaasahang pag kakamali ang nangyari";
};

/**
 * @returns a value mesage for the unexpected error message in english version
 */
export const UnexpectedErrorMessageEnglish = (): string => {
  return "Unexpected has occured";
};

export const FormErrorMessage = (): string => {
  return "May mali sa iyong ipinasa, baguhin muna ito";
};

/**
 * used to convert the user farmerAreaMasurement into a hectare value
 * @param measurement of the area (e.g. 200)
 * @param unit of the area (e.g. sqm(square meter))
 * @returns the converted measurements value of the area into a hectare value
 */
export const ConvertMeassurement = (
  measurement: string,
  unit: string
): string => {
  switch (unit) {
    case "ac":
      return (Number(measurement) / 2.471).toFixed(4);
    case "sqft":
      return (Number(measurement) / 107600).toFixed(4);
    case "sqm":
      return (Number(measurement) / 10000).toFixed(4);
    default:
      return measurement;
  }
};

/**
 * function for getting the point coordinate(longitude and latitude) of the brgy
 * @param brgy that you want to get the coordinate
 * @returns longitude and latitude object
 */
export function getPointCoordinate(
  brgy: barangayType | "calauan"
): getPointCoordinateReturnType {
  return {
    longitude: pointCoordinates[brgy][0],
    latitude: pointCoordinates[brgy][1],
  };
}

export function getBrgyCoordinate(brgy: brangayWithCalauanType): LngLatLike {
  return [pointCoordinates[brgy][0], pointCoordinates[brgy][1]];
}

/**
 * function that checks the mark location if its inside the polygon(highlithed part of the city)
 * @param lng longtitude coordinate
 * @param lat latitude coordinate
 * @param brgy name of the barangay
 * @returns boolean val
 */
export function pointIsInsidePolygon(
  lng: number,
  lat: number,
  brgy: barangayType
) {
  return booleanPointInPolygon(
    point([lng, lat]),
    polygon(polygonCoordinates[brgy])
  );
}

/**
 * function for dynamic zoom of the map
 * @param brgy that you want to zoom
 * @returns value that can be use for the zoom prop of mapComponent
 */
export function mapZoomValByBarangay(brgy: brangayWithCalauanType) {
  switch (brgy) {
    case "balayhangin":
      return 13.5;
    case "bangyas":
      return 13.2;
    case "dayap":
      return 13.4;
    case "hanggan":
      return 13.8;
    case "imok":
      return 14;
    case "kanluran":
      return 15;
    case "lamot 1":
      return 13.2;
    case "lamot 2":
      return 13;
    case "limao":
      return 13;
    case "mabacan":
      return 13.3;
    case "masiit":
      return 13.2;
    case "paliparan":
      return 13.3;
    case "perez":
      return 13;
    case "prinza":
      return 14;
    case "san isidro":
      return 13.5;
    case "santo tomas":
      return 14;
    case "silangan":
      return 16;
    default:
      return 8;
  }
}

/**
 * function for transforming the given coordinates into Geojson structure feature type point
 * @param coordinates that you want to make a point type
 * @returns a geojson fature point type
 */
export function intoFeaturePoint(lng: number, lat: number, name?: string) {
  return point([lng, lat], name ? { name: name } : undefined);
}

/**
 * function for transforming the given coordinates into Geojson structure feature type polygon
 * @param coordinates that you want to make a polygon type
 * @returns a geojson fature polygon type
 */
export function intoFeaturePolygon(coordinates: number[][][]) {
  return polygon(coordinates);
}

export function intoFeatureCollection(data: intoFeatureCollectionDataParam[]) {
  const val = data.map((geoType) => {
    if (geoType.type === "polygon")
      return polygon(geoType.coordinates, {
        name: geoType.name,
      });
    else
      return point([geoType.coordinates.lng, geoType.coordinates.lat], {
        name: geoType.name,
      });
  });

  return featureCollection(val as Feature[]);
}

export function farmAreaMeasurementValue(): {
  radioLabel: string;
  radioValue: string;
}[] {
  return [
    { radioLabel: "Ektarya (Hectares)", radioValue: "ha" },
    { radioLabel: "Akre (Acres)", radioValue: "ac" },
    { radioLabel: "Talampakang Kuwadrado (Square Feet)", radioValue: "sqft" },
    { radioLabel: "Metrong Kuwadrado (Square Meter)", radioValue: "sqm" },
  ];
}

export function pickBrgyFirst(): string {
  return "Pumili muna ng barangay na pinag tataniman";
}

/**
 * function for viewing the crop in the map component
 * @param lng coordinates of the crop
 * @param lat coordinates of the crop
 * @param brgy barangay where the crop located
 * @param mapRef useRef value of the map
 */
export function ViewCrop(
  lng: number,
  lat: number,
  brgy: barangayType,
  mapRef: RefObject<MapRef | null>
) {
  mapRef.current?.flyTo({
    center: [
      lng ? lng : pointCoordinates.calauan[0],
      lat ? lat : pointCoordinates.calauan[1],
    ],
    duration: 2000,
    zoom: mapZoomValByBarangay(brgy),
  });

  console.log(document.getElementById("mapCanvas"));

  document
    .getElementById("mapCanvas")
    ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * function to transform or to make a logo base on the state of the weather in day
 * @param code state of the weather that comes from weatherApi
 * @return icon
 */
export const makeWeatherIcon = ({
  code,
  isDay,
}: {
  code: number;
  isDay: 1 | 0;
}): LucideIcon => {
  // ☀️ CLEAR CONDITIONS
  if (code === 1000) {
    if (isDay === 1) return Sun; // Sunny
    else return Moon; // Clear
  }

  // 🌤️ PARTLY CLOUDY DAY / NIGHT
  if (code === 1003) {
    if (isDay === 1) return CloudSun;
    else return CloudMoon;
  }

  // ☔ CLOUDY AND  MIGHT RAIN WHILE IN DAY / NIGHT
  if (code === 1063) {
    if (isDay === 1) return CloudSunRain; // IN DAY
    else return CloudMoonRain; // IN NIGHT
  }

  // ☁️ CLOUDY / OVERCAST / FOG  CONDITIONS
  if (code === 1006 || code === 1009) return Cloud;

  // MIST
  if (code === 1030 || code === 1135 || code === 1147) return Cloudy;

  // ⛈️ THUNDER CONDITIONS
  if (code === 1087 || code === 1273 || code === 1276) return CloudLightning;

  // 🌧️ DRIZZLE / LIGHT RAIN CONDITIONS
  if (
    code === 1072 ||
    code === 1150 ||
    code === 1153 ||
    code === 1168 ||
    // 🌨️ SLEET / ICE PELLETS CONDITIONS
    code === 1069 ||
    code === 1204 ||
    code === 1207 ||
    code === 1237 ||
    code === 1249 ||
    code === 1252 ||
    code === 1261 ||
    code === 1264
  )
    return CloudDrizzle;

  // LIGHT RAIN CONDITIONS
  if (code === 1180 || code === 1183 || code === 1198 || code === 1240)
    return CloudHail;

  // 💧 MODERATE RAIN CONDITIONS
  if (code === 1186 || code === 1189) return CloudRain;

  //  HEAVY RAIN CONDITIONS
  if (
    code === 1171 ||
    code === 1192 ||
    code === 1195 ||
    code === 1201 ||
    code === 1243 ||
    code === 1246
  )
    return CloudRainWind;

  return HelpCircle; // Fallback for unknown codes
};

/**
 * Translates the WeatherAPI condition text into Tagalog.
 * @param englishText The English weather condition text (e.g., "Sunny").
 * @returns The Tagalog translation string.
 */
export const translateWeatherConditionToTagalog = (
  englishText: string
): string => {
  // Normalize the input text for consistent matching (e.g., trim whitespace)
  const normalizedText = englishText.trim();

  switch (normalizedText.toLowerCase()) {
    // CLEAR / SUNNY
    case "sunny":
    case "clear":
      return "Hindi Maulap";

    // PARTLY CLOUDY
    case "partly cloudy":
      return "Bahagyang Maulap";

    // CLOUDLY
    case "cloudy":
    case "overcast":
      return "Maulap";

    // FOG / MIST
    case "mist":
    case "fog":
    case "freezing fog":
      return "Mahamog";

    // DRIZZLE / RAIN
    case "patchy light drizzle":
    case "light drizzle":
    case "freezing drizzle":
    case "heavy freezing drizzle":
    case "patchy sleet possible":
    case "patchy rain nearby":
    case "light sleet":
    case "moderate or heavy sleet":
    case "light sleet showers":
    case "moderate or heavy sleet showers":
    case "patchy freezing drizzle possible":
      return "Mahina o Patak-patak na Ambon";

    // MIGHT RAIN
    case "patchy rain possible":
    case "patchy light rain":
      return "Posibleng May Bahagyang Ulan";

    // SLIGHT RAIN
    case "light rain":
    case "light freezing rain":
    case "light rain shower":
      return "Mahina o Bahagyang Ulan";

    // MODERATE OR HEAVY RAIN FALL
    case "moderate rain at times":
    case "moderate rain":
    case "moderate or heavy rain shower":
    case "moderate or heavy freezing rain":
    case "light showers of ice pellets":
      return "Katamtaman o Malakas na Pag-ulan";

    // HEAVY RAIN FALL
    case "heavy rain at times":
    case "heavy rain":
    case "torrential rain shower":
    case "moderate or heavy showers of ice pellets":
      return "Malakas na Pag-ulan";

    // THUNDER
    case "thundery outbreaks possible":
    case "patchy light rain with thunder":
    case "moderate or heavy rain with thunder":
      return "Posibleng May Pagkidlat at Pagkulog";

    // DEFAULT
    default:
      return "Hindi Matukoy Ang Panahon";
  }
};

/**
 * function for converting the military time to readable time that uses pm and am
 * @param time military time that you want to convert
 * @returns the time
 *
 * @example
 * const time = converTimeToAMPM("20:45")
 *
 * console.log(time) // 10:45 pm
 *
 *
 */
export const converTimeToAMPM = (time: string) =>
  new Date(`2001-01-01T${time}:00`)
    .toLocaleDateString("fil-PH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .split(",")[1]
    .trim();

export const capitalizeFirstLetter = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);
