import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
 return {
  name: "MATRIX - Market Analysis, Trading & Research Intelligence Exchange",
  short_name: "MATRIX",
  description: "Market information dashboard for gold, forex, indices, and crypto.",
  start_url: "/",
  display: "standalone",
  background_color: "#0b0f14",
  theme_color: "#0b0f14",
  icons: [],
 };
}
