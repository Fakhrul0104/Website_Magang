<<<<<<< HEAD
import { iconPaths } from "../data/links";
import type { IconName } from "../types/link";

type IconProps = {
    name: IconName;
    size?: number;
};

export default function Icon({
    name,
    size = 24,
}: IconProps) {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height={size}
            viewBox="0 0 24 24"
            width={size}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
        >
            {iconPaths[name]}
        </svg>
    );
}
=======
import type { ReactNode } from "react"

import type { IconName } from "@/types"

export const ICON_NAMES: IconName[] = [
  "anchor",
  "ship",
  "compass",
  "map",
  "radio",
  "cloud",
  "book",
  "users",
  "globe",
  "box",
]

const iconPaths: Record<IconName, ReactNode> = {
  anchor: (
    <>
      <path d="M12 3v17M8 7h8M5 13a7 7 0 0 0 14 0M5 13l-2 2M19 13l2 2" />
      <circle cx="12" cy="3" r="2" />
    </>
  ),
  ship: (
    <path d="m4 18 2-8h12l2 8M8 10V6h8v4M12 6V3M3 18c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 3 2" />
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
      <path d="M9 3v15M15 6v15" />
    </>
  ),
  radio: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="m7 8 10-5M8 13h3M8 16h3" />
      <circle cx="16" cy="15" r="2.5" />
    </>
  ),
  cloud: (
    <>
      <path d="M6 17a4 4 0 1 1 1-7.87A5.5 5.5 0 0 1 17.5 11H18a3 3 0 0 1 0 6H6Z" />
      <path d="M8 21h8" />
    </>
  ),
  book: (
    <path d="M4 5a3 3 0 0 1 3-2h5v17H7a3 3 0 0 0-3 2V5ZM20 5a3 3 0 0 0-3-2h-5v17h5a3 3 0 0 1 3 2V5Z" />
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  box: <path d="m4 7 8-4 8 4-8 4-8-4ZM4 7v10l8 4 8-4V7M12 11v10" />,
}

interface IconProps {
  name: IconName
  size?: number
}

export default function Icon({ name, size = 24 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    >
      {iconPaths[name]}
    </svg>
  )
}
>>>>>>> 7c7bdb2cd134ad60808723de9375e7876f0cc2f8
