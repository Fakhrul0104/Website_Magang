import type { ReactNode } from "react";
import type { IconName, LinkItem } from "../types/link";

export const categories = [
    "Pelayanan Kapal",
    "Komersial",
    "Keuangan",
    "IT Cabang",
    "Umum"
];

export const iconPaths: Record<IconName, ReactNode> = {
    anchor: (
        <>
            <path d="M12 3v17M8 7h8M5 13a7 7 0 0 0 14 0M5 13l-2 2M19 13l2 2" />
            <circle cx="12" cy="3" r="2" />
        </>
    ),

    ship: (
        <>
            <path d="m4 18 2-8h12l2 8M8 10V6h8v4M12 6V3M3 18c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 3 2" />
        </>
    ),

    compass: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
        </>
    ),
};
