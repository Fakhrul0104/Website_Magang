export type IconName =
    | "anchor"
    | "ship"
    | "compass"
    ;

export type LinkItem = {
    id: string;
    title: string;
    description: string;
    url: string;
    category: string;
    icon: IconName;
    image?: string;
};
