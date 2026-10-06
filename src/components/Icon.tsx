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