import { Platform } from "react-native";

const fontFamily = Platform.OS === "ios" ? "System" : "Roboto";

export const HEADING_1 = {
  fontFamily,
  fontSize: 24,
  fontWeight: "700",
  lineHeight: 32,
};

export const HEADING_2 = {
  fontFamily,
  fontSize: 20,
  fontWeight: "600",
  lineHeight: 28,
};

export const HEADING_3 = {
  fontFamily,
  fontSize: 18,
  fontWeight: "600",
  lineHeight: 24,
};

export const BODY = {
  fontFamily,
  fontSize: 16,
  fontWeight: "400",
  lineHeight: 24,
};

export const BODY_SMALL = {
  fontFamily,
  fontSize: 14,
  fontWeight: "400",
  lineHeight: 20,
};

export const CAPTION = {
  fontFamily,
  fontSize: 12,
  fontWeight: "400",
  lineHeight: 16,
};
