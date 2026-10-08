import Icon from "./Icon";
import type { LinkItem } from "../types/link";

interface LinkVisualProps {
  link: LinkItem;
  size?: number;
}

export default function LinkVisual({ link, size = 28 }: LinkVisualProps) {
  return link.image ? (
    <img src={link.image} alt="" />
  ) : (
    <Icon name={link.icon} size={size} />
  );
}