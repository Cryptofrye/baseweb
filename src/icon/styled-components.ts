/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import { styled } from '../styles';
import type { Theme } from '../styles/types';
import type { StyledComponentArgs } from './types';
import type { StyleObject } from 'styletron-standard';

export function getSvgStyles({
  $theme,
  $size,
  $color,
}: {
  $theme: Theme;
  $size?;
  $color?;
}): StyleObject {
  let size = $theme.sizing.scale600;
  if ($size) {
    if ($theme.sizing[$size]) {
      size = $theme.sizing[$size];
    } else if (typeof $size === 'number') {
      size = `${$size}px`;
    } else {
      size = $size;
    }
  }

  let color = 'currentColor';
  if ($color) {
    if ($theme.colors[$color]) {
      color = $theme.colors[$color];
    } else {
      color = $color;
    }
  }

  return {
    display: 'inline-block',
    fill: color,
    color: color,
    height: size,
    width: size,
  };
}

export const Svg = styled<'svg', StyledComponentArgs>('svg', getSvgStyles);
