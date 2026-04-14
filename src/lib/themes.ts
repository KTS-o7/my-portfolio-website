export type ColorTokens = {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
};

export type PaletteTokens = {
  dark: ColorTokens;
  light: ColorTokens;
};

export const themePalettes: Record<string, PaletteTokens> = {
  // 0. Default — ink + teal + amber
  inkTeal: {
    dark: {
      background: "#0b0f14",
      surface: "#0f1823",
      primary: "#f59e0b",
      secondary: "#14b8a6",
      accent: "#e2e8f0",
      textPrimary: "#e6edf3",
      textSecondary: "#b6c2d2",
      textTertiary: "#7b8797",
    },
    light: {
      background: "#fbf7f2",
      surface: "#ffffff",
      primary: "#b45309",
      secondary: "#0f766e",
      accent: "#0f172a",
      textPrimary: "#0f172a",
      textSecondary: "#334155",
      textTertiary: "#64748b",
    },
  },
  // 1. Gold & Teal
  goldTeal: {
    dark: {
      background: "#050e0d",
      surface: "#0a1a18",
      primary: "#FFBA00",
      secondary: "#11AC9D",
      accent: "#B2F7EF",
      textPrimary: "#e8faf8",
      textSecondary: "#9dd9d2",
      textTertiary: "#5fa099",
    },
    light: {
      background: "#f0fffe",
      surface: "#ffffff",
      primary: "#b58600",
      secondary: "#0b7a71",
      accent: "#012e2b",
      textPrimary: "#012e2b",
      textSecondary: "#134e48",
      textTertiary: "#3d8f87",
    },
  },
  // 2. Forest & Pink
  forestPink: {
    dark: {
      background: "#020f08",
      surface: "#041a10",
      primary: "#EC839E",
      secondary: "#D3B238",
      accent: "#F4B8C7",
      textPrimary: "#fce8ed",
      textSecondary: "#c4a8b0",
      textTertiary: "#6a7060",
    },
    light: {
      background: "#f0fff6",
      surface: "#ffffff",
      primary: "#0B6043",
      secondary: "#D3B238",
      accent: "#020f08",
      textPrimary: "#020f08",
      textSecondary: "#0d3020",
      textTertiary: "#3d6050",
    },
  },
  // 3. Purple & Yellow
  purpleYellow: {
    dark: {
      background: "#0d0015",
      surface: "#1a0030",
      primary: "#F9D402",
      secondary: "#9C59BD",
      accent: "#e8d0ff",
      textPrimary: "#f0e8ff",
      textSecondary: "#c0a0d8",
      textTertiary: "#7a5099",
    },
    light: {
      background: "#faf0ff",
      surface: "#ffffff",
      primary: "#660099",
      secondary: "#C79C0E",
      accent: "#0d0015",
      textPrimary: "#0d0015",
      textSecondary: "#2a0044",
      textTertiary: "#6a3088",
    },
  },
  // 4. Blue & Gold — commented out, available for later
  // blueGold: {
  //   dark: {
  //     background: "#000814",
  //     surface: "#001D3D",
  //     primary: "#CCA000",
  //     secondary: "#F0CB46",
  //     accent: "#e0efff",
  //     textPrimary: "#e0efff",
  //     textSecondary: "#a0bce0",
  //     textTertiary: "#4a78b8",
  //   },
  //   light: {
  //     background: "#f0f4ff",
  //     surface: "#ffffff",
  //     primary: "#CCA000",
  //     secondary: "#003566",
  //     accent: "#000814",
  //     textPrimary: "#000814",
  //     textSecondary: "#00224a",
  //     textTertiary: "#2a5a90",
  //   },
  // },
  // 5. Dark Green & Gold
  darkGreenGold: {
    dark: {
      background: "#020d0a",
      surface: "#06362D",
      primary: "#FFD500",
      secondary: "#D1A505",
      accent: "#DEE2B1",
      textPrimary: "#eef5e0",
      textSecondary: "#b0c8a0",
      textTertiary: "#5a8870",
    },
    light: {
      background: "#f0fff6",
      surface: "#ffffff",
      primary: "#D1A505",
      secondary: "#06362D",
      accent: "#020d0a",
      textPrimary: "#020d0a",
      textSecondary: "#0a2820",
      textTertiary: "#2a6050",
    },
  },
  // 6. Navy Blue & Gold
  navyBlueGold: {
    dark: {
      background: "#00001a",
      surface: "#000040",
      primary: "#FFD60A",
      secondary: "#FFBF1C",
      accent: "#dce8ff",
      textPrimary: "#dce8ff",
      textSecondary: "#9ab0e0",
      textTertiary: "#4868b8",
    },
    light: {
      background: "#f0f0ff",
      surface: "#ffffff",
      primary: "#D1A309",
      secondary: "#000080",
      accent: "#00001a",
      textPrimary: "#00001a",
      textSecondary: "#00006a",
      textTertiary: "#2828a0",
    },
  },
};

// Human-readable labels for the preview panel
export const paletteLabels: Record<string, string> = {
  inkTeal: "Ink & Teal (default)",
  goldTeal: "Gold & Teal",
  forestPink: "Forest & Pink",
  purpleYellow: "Purple & Yellow",
  // blueGold: "Blue & Gold",
  darkGreenGold: "Dark Green & Gold",
  navyBlueGold: "Navy Blue & Gold",
};
