import { Path, Svg } from "react-native-svg";

export function ChevronRightIcon({ fill = "#222222" }: { fill?: string }) {
  return (
    <Svg width="10" height="16" viewBox="0 0 10 16" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.77448 7.45693C10.0752 7.75712 10.0752 8.2421 9.77448 8.54307L2.638 15.6743C2.20392 16.1086 1.49768 16.1086 1.06283 15.6743C0.62875 15.24 0.62875 14.5351 1.06283 14.1008L7.16769 7.99961L1.06283 1.89917C0.62875 1.46488 0.62875 0.76002 1.06283 0.325723C1.49768 -0.108574 2.20392 -0.108574 2.638 0.325723L9.77448 7.45693Z"
        fill={fill}
      />
    </Svg>
  );
}

