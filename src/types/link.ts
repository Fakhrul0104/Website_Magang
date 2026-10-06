export type IconName =
    | "anchor"
    | "ship"
    | "compass"
    | "map"
    | "radio"
    | "cloud"
    | "book"
    | "users"
    | "globe"
    | "box";

export type LinkItem = {
    id: string;
    title: string;
    description: string;
    url: string;
    category: string;
    icon: IconName;
    image?: string;
};
