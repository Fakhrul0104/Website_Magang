export type IconName =
    | "anchor"
    | "ship"
    | "compass"
    | "file-spreadsheet"
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
