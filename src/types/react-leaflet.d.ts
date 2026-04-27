import "react-leaflet";

declare module "react-leaflet" {
  interface MapContainerProps {
    center?: [number, number];
    zoom?: number;
  }

  interface TileLayerProps {
    attribution?: string;
  }
}
