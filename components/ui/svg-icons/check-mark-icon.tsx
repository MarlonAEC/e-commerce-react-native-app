import { Path, Svg } from "react-native-svg";

export function CheckMarkIcon({ fill = "#2AA952" }: { fill?: string }) {
  return (
    <Svg width="19" height="16" viewBox="0 0 19 16" fill="none">
      <Path
        d="M6.03809 12.6234L1.53383 7.64802L0 9.33035L6.03809 16L19 1.68233L17.477 0L6.03809 12.6234Z"
        fill={fill}
      />
    </Svg>
  );
}
