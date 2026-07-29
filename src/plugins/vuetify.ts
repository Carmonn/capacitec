import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const lightTheme = {
  dark: false,
  colors: {
    primary: "#1571C4",
    "primary-darken-1": "#0A3D62",
    secondary: "#2AACE2",
    accent: "#7FD1F0",
    background: "#F5F8FB",
    surface: "#FFFFFF",
    "on-background": "#1A2B3C",
    "on-surface": "#1A2B3C",
    "text-primary": "#1A2B3C",
    "text-secondary": "#5A6B7B",
    success: "#1E9E5A",
    "success-soft": "#E8F7EE",
    error: "#D64545",
    "error-soft": "#FBEAEA",
    warning: "#E0A526",
    "warning-soft": "#FDF3DD",
    info: "#1571C4",
    "info-soft": "#E8F2FB",
  },
};

const darkTheme = {
  dark: true,
  colors: {
    primary: "#2AACE2",
    "primary-darken-1": "#1571C4",
    secondary: "#7FD1F0",
    accent: "#2AACE2",
    background: "#0A3D62",
    surface: "#123F60",
    "on-background": "#F5F8FB",
    "on-surface": "#F5F8FB",
    "text-primary": "#F5F8FB",
    "text-secondary": "#BFD6E6",
    success: "#1E9E5A",
    "success-soft": "#123026",
    error: "#D64545",
    "error-soft": "#3C1D1D",
    warning: "#E0A526",
    "warning-soft": "#3D3215",
    info: "#2AACE2",
    "info-soft": "#173B54",
  },
};

export default createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "lightTheme",
    themes: {
      lightTheme,
      darkTheme,
    },
  },
});
