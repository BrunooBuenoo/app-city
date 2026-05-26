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
        /* ─── Landing-Page Institutional Palette ─── */
        "primary": "#1a8ccc",
        "primary-hover": "#1572a6",
        "primary-container": "#E8F2F8",
        "on-primary": "#ffffff",
        "on-primary-container": "#1a8ccc",
        "primary-fixed": "#E8F2F8",
        "primary-fixed-dim": "#B3DCF2",
        "on-primary-fixed": "#0A3E5C",
        "on-primary-fixed-variant": "#1572a6",

        "secondary": "#F59E0B",
        "secondary-container": "#FEF3C7",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#92400E",
        "secondary-fixed": "#FEF3C7",
        "secondary-fixed-dim": "#FCD34D",
        "on-secondary-fixed": "#78350F",
        "on-secondary-fixed-variant": "#B45309",

        "tertiary": "#10B981",
        "tertiary-container": "#D1FAE5",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#065F46",
        "tertiary-fixed": "#D1FAE5",
        "tertiary-fixed-dim": "#6EE7B7",
        "on-tertiary-fixed": "#064E3B",
        "on-tertiary-fixed-variant": "#047857",

        "error": "#EF4444",
        "error-container": "#FEE2E2",
        "on-error": "#ffffff",
        "on-error-container": "#991B1B",

        "background": "#F9FAFB",
        "on-background": "#111827",
        "surface": "#F9FAFB",
        "on-surface": "#111827",
        "on-surface-variant": "#6B7280",

        "surface-bright": "#FFFFFF",
        "surface-dim": "#F3F4F6",
        "surface-tint": "#1a8ccc",
        "surface-variant": "#F9FAFB",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F9FAFB",
        "surface-container": "#F3F4F6",
        "surface-container-high": "#E5E7EB",
        "surface-container-highest": "#D1D5DB",

        "outline": "#9CA3AF",
        "outline-variant": "#E5E7EB",

        "inverse-surface": "#112F4E",
        "inverse-on-surface": "#FAF7F2",
        "inverse-primary": "#7CC8ED",

        /* Accent aliases */
        "accent": "#1a8ccc",
        "accent-light": "#E8F2F8",
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
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
        "label-lg": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "label-sm": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "body-md": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "headline-sm": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "label-md": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "headline-lg-mobile": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "body-lg": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "body-sm": ["Plus Jakarta Sans", "Inter", "sans-serif"]
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
      },
      boxShadow: {
        "card": "0 1px 2px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 2px 8px rgba(0, 0, 0, 0.06)",
        "elevated": "0 4px 12px rgba(0, 0, 0, 0.05)",
      }
    }
  },
  plugins: [],
};

export default config;
