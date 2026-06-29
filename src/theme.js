import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    heading: '"Fraunces", serif',
    body: '"Outfit", sans-serif',
  },
  colors: {
    brand: {
      50: "#eef6ff",
      100: "#dceafe",
      200: "#bed8fd",
      300: "#8abcfb",
      400: "#4f94f4",
      500: "#2f6ce0",
      600: "#2354b6",
      700: "#1e4492",
      800: "#1c3c73",
      900: "#192f59",
    },
    surface: {
      50: "#f8fbff",
      100: "#eef3fb",
      200: "#dfe8f4",
      300: "#c9d7ea",
    },
  },
  styles: {
    global: {
      body: {
        bg: "linear-gradient(180deg, #f2f6ff 0%, #e7effb 38%, #dbe6f5 100%)",
        color: "gray.800",
        fontFamily: '"Outfit", sans-serif',
      },
      "::selection": {
        bg: "brand.200",
        color: "brand.900",
      },
      "*": {
        boxSizing: "border-box",
      },
    },
  },
  shadows: {
    soft: "0 12px 30px rgba(31, 54, 91, 0.16)",
    panel: "0 18px 48px rgba(30, 46, 79, 0.18)",
    insetPanel:
      "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -8px 18px rgba(31,54,91,0.08)",
    button:
      "0 10px 20px rgba(47,108,224,0.24), inset 0 1px 0 rgba(255,255,255,0.36)",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "999px",
        fontWeight: 700,
        letterSpacing: "0.01em",
        boxShadow: "button",
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: "surface.50",
          borderRadius: "18px",
          borderColor: "surface.200",
          boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.08)",
          _focusVisible: {
            borderColor: "brand.400",
            boxShadow:
              "0 0 0 3px rgba(79, 148, 244, 0.2), inset 0 1px 2px rgba(15, 23, 42, 0.08)",
          },
        },
      },
    },
    ModalContent: {
      baseStyle: {
        borderRadius: "28px",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "panel",
        bg: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(243,247,253,0.94) 100%)",
      },
    },
  },
});

export default theme;
