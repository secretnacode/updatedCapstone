import { MapComponentPropType } from "@/types";
import {
  pointCoordinates,
  polygonCoordinates,
} from "@/util/helper_function/barangayCoordinates";
import Map, {
  Layer,
  LngLatBoundsLike,
  Source,
  ViewState,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Head from "next/head";
import { FC } from "react";

const calauanViewState: Partial<ViewState> = {
  longitude: pointCoordinates.calauan[0],
  latitude: pointCoordinates.calauan[1],
};

const calauanMaxBounds: LngLatBoundsLike = [
  // SW
  [121.18760220670634, 14.06890248899424], //longitude, latitude
  // NE
  [121.44236799329536, 14.221868980179238], //longitude, latitude
];

export const MapComponent: FC<MapComponentPropType> = ({
  cityToHighlight = polygonCoordinates.calauan,
  children,
  ref,
  mapWidth = "100%",
  mapHeight,
  ...mapProp
}) => {
  return (
    <>
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
        <Source type={"geojson"} data={cityToHighlight}>
          <Layer
            type="fill"
            paint={{ "fill-color": "yellow", "fill-opacity": 0.2 }}
          />
          <Layer type="line" paint={{ "line-dasharray": [2, 3] }} />
        </Source>

        {children}
      </Map>
    </>
  );
};
