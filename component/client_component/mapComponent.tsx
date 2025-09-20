import {
  MapComponentPropType,
  MapMarkerComponentPropType,
  MapSourceComponentPropType,
} from "@/types";
import {
  pointCoordinates,
  polygonCoordinates,
} from "@/util/helper_function/barangayCoordinates";
import { intoFeaturePolygon } from "@/util/helper_function/reusableFunction";
import Map, {
  Layer,
  LngLatBoundsLike,
  Marker,
  Source,
  ViewState,
} from "@vis.gl/react-maplibre";
import { MapPin } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import Head from "next/head";
import { FC } from "react";

const calauanViewState: Partial<ViewState> = {
  longitude: pointCoordinates.calauan[0],
  latitude: pointCoordinates.calauan[1],
  zoom: 8,
};

const calauanMaxBounds: LngLatBoundsLike = [
  // SW
  [121.18760220670634, 14.06890248899424], //longitude, latitude
  // NE
  [121.44236799329536, 14.221868980179238], //longitude, latitude
];

/**
 *
 * @param param0
 * @returns
 */
export const MapComponent: FC<MapComponentPropType> = ({
  children,
  cityToHighlight,
  ref,
  mapWidth = "100%",
  mapHeight,
  ...mapProp
}) => {
  return (
    <div className="rounded-xl overflow-hidden input !p-0">
      <Head>
        <link
          href="https://unpkg.com/maplibre-gl@5.7.1/dist/maplibre-gl.css"
          rel="stylesheet"
        />
      </Head>
      <Map
        initialViewState={calauanViewState}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: mapWidth, height: mapHeight }}
        minZoom={calauanViewState.zoom}
        maxPitch={0}
        maxBounds={calauanMaxBounds}
        cursor="pointer"
        doubleClickZoom={false}
        ref={ref}
        {...mapProp}
      >
        <MapSourceComponent data={cityToHighlight} />

        {children}
      </Map>
    </div>
  );
};

export const MapSourceComponent: FC<MapSourceComponentPropType> = ({
  data = intoFeaturePolygon(polygonCoordinates.calauan),
}) => {
  return (
    <Source type={"geojson"} data={data}>
      <Layer
        type="fill"
        paint={{ "fill-color": "yellow", "fill-opacity": 0.2 }}
      />
      <Layer type="line" paint={{ "line-dasharray": [2, 3] }} />
    </Source>
  );
};

export const MapMarkerComponent: FC<MapMarkerComponentPropType> = ({
  markerLng,
  markerLat,
}) => {
  return (
    <Marker
      longitude={markerLng}
      latitude={markerLat}
      anchor="bottom"
      style={{ cursor: "pointer" }}
    >
      <MapPin className="logo bg-red-400" />
    </Marker>
  );
};
