import { Path, Svg } from "react-native-svg";

export function HomeIcon({
  fill = "#9B9B9B",
  stroke,
}: {
  fill: string;
  stroke?: string;
}) {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.2941 27V18.5294H17.9412V27H25V15.7059H29.2353L15.1176 3L1 15.7059H5.23529V27H12.2941Z"
        fill={fill}
        stroke={stroke}
      />
    </Svg>
  );
}
