import { Path, Svg } from "react-native-svg";

export function SortIcon({ fill = "#222222" }: { fill?: string }) {
  return (
    <Svg width="14" height="18" viewBox="0 0 14 18" fill="none">
      <Path
        d="M11 14.01V7H9V14.01H6L10 18L14 14.01H11ZM4 0L0 3.99H3V11H5V3.99H8L4 0Z"
        fill={fill}
      />
    </Svg>
  );
}
