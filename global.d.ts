import type React from "react";

declare namespace JSX {
  interface IntrinsicElements {
    "ion-icon": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      name?: string;     // e.g. "trophy", "star", "chevron-forward"
      src?: string;      // for custom SVGs if you ever need
      size?: "small" | "large"; // optional Ionicons sizes
      "aria-hidden"?: boolean | "true" | "false";
    };
  }
}