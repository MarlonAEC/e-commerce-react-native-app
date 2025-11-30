import { Rect, Svg } from "react-native-svg";

export function MinusIcon({ fill = "#9B9B9B" }: { fill?: string }) {
  return (
    <Svg width="14" height="2" viewBox="0 0 14 2" fill="none">
      <Rect width="14" height="2" fill={fill} />
    </Svg>
  );
}
