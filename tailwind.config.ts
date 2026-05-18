import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "secondary": "#b71422",
        "surface-bright": "#f9f9fc",
        "tertiary-container": "#a33500",
        "surface": "#f9f9fc",
        "primary": "#003d9b",
        "inverse-primary": "#b2c5ff",
        "surface-container": "#eeeef0",
        "error": "#ba1a1a",
        "on-secondary-container": "#fffbff",
        "primary-fixed-dim": "#b2c5ff",
        "background": "#f9f9fc",
        "on-surface-variant": "#434654",
        "surface-container-low": "#f3f3f6",
        "outline-variant": "#c3c6d6",
        "on-error-container": "#93000a",
        "surface-container-highest": "#e2e2e5",
        "on-tertiary-fixed-variant": "#812800",
        "on-primary-fixed-variant": "#0040a2",
        "inverse-on-surface": "#f0f0f3",
        "on-error": "#ffffff",
        "on-tertiary-container": "#ffc6b2",
        "primary-fixed": "#dae2ff",
        "surface-container-high": "#e8e8ea",
        "inverse-surface": "#2f3133",
        "tertiary-fixed-dim": "#ffb59b",
        "tertiary-fixed": "#ffdbcf",
        "surface-tint": "#0c56d0",
        "secondary-fixed-dim": "#ffb3ae",
        "primary-container": "#0052cc",
        "on-secondary-fixed-variant": "#930014",
        "on-secondary-fixed": "#410004",
        "surface-variant": "#e2e2e5",
        "on-tertiary-fixed": "#380d00",
        "error-container": "#ffdad6",
        "on-tertiary": "#ffffff",
        "on-surface": "#1a1c1e",
        "on-primary-container": "#c4d2ff",
        "outline": "#737685",
        "on-primary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "tertiary": "#7b2600",
        "surface-dim": "#dadadc",
        "on-background": "#1a1c1e",
        "on-secondary": "#ffffff",
        "on-primary-fixed": "#001848",
        "secondary-container": "#db3237",
        "secondary-fixed": "#ffdad7"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "64px",
        "gutter": "24px",
        "container-max": "1280px",
        "margin-mobile": "16px",
        "unit": "8px"
      },
      fontFamily: {
        "label-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-sm": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"]
      },
      fontSize: {
        "label-lg": ["14px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "label-sm": ["11px", {"lineHeight": "12px", "fontWeight": "500"}],
        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "headline-sm": ["20px", {"lineHeight": "28px", "letterSpacing": "0em", "fontWeight": "600"}],
        "label-md": ["12px", {"lineHeight": "14px", "fontWeight": "500"}],
        "headline-lg-mobile": ["32px", {"lineHeight": "38px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-lg": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
        "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}]
      }
    }
  },
  plugins: [],
};

export default config;
