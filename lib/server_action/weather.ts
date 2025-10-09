"use server";

import {
  barangayType,
  currentWeatherType,
  getWeatherTodayReturnType,
} from "@/types";
import { currentWeatherBaseLink } from "@/util/apiLinks";
import { pointCoordinates } from "@/util/helper_function/barangayCoordinates";

export const getWeatherToday = async (
  userLocation: barangayType
): Promise<getWeatherTodayReturnType> => {
  try {
    const [lng, lat] = pointCoordinates[userLocation];

    const weatherRes = await fetch(
      currentWeatherBaseLink({ lng: lng, lat: lat })
    );

    const data: currentWeatherType = await weatherRes.json();

    if (!weatherRes.ok) {
      console.log(data);
      return {
        success: false,
        notifError: [
          {
            message:
              "May hindi inaasahang nang yari sa habang kinukuha ang kalagayan ng panahon ngayon",
            type: "error",
          },
        ],
      };
    }

    return { success: true, weatherData: data.current };
  } catch (error) {
    console.log(
      `May hindi inaasahang nang yari sa pag kuha ng kalagayan ng panahon ngayon: ${
        (error as Error).message
      }`
    );
    return {
      success: false,
      notifError: [
        {
          message: `May hindi inaasahang nang yari sa pag kuha ng kalagayan ng panahon ngayon`,
          type: "error",
        },
      ],
    };
  }
};
