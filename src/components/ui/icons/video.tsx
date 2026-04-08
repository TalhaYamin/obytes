import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function Video({ color = '#000', ...props }: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        d="M8.6 4.5h6.8c2.71 0 4.1 1.39 4.1 4.1v6.8c0 2.71-1.39 4.1-4.1 4.1H8.6c-2.71 0-4.1-1.39-4.1-4.1V8.6c0-2.71 1.39-4.1 4.1-4.1Zm2.16 4.36c-.59-.36-1.26-.39-1.77-.08-.52.31-.82.9-.82 1.56v3.32c0 .66.3 1.25.82 1.56.51.31 1.18.28 1.77-.08l2.71-1.66c.56-.34.89-.92.89-1.48s-.33-1.14-.89-1.48l-2.71-1.66Z"
        fill={color}
      />
    </Svg>
  );
}
