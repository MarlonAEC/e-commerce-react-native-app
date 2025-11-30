import { Path, Svg } from "react-native-svg";

export function PlusIcon({ fill = "#9B9B9B" }: { fill?: string }) {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 0V6H0V8H6V14H8V8H14V6H8V0H6Z"
        fill={fill}
      />
    </Svg>
  );
}
