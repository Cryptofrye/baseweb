/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';

import type { Override } from '../helpers/overrides';
import type { IconProps } from '../icon';
import { ARTWORK_SIZES, SHAPE } from './constants';

export type ArtworkSizes =
  | typeof ARTWORK_SIZES.SMALL
  | typeof ARTWORK_SIZES.MEDIUM
  | typeof ARTWORK_SIZES.LARGE;

export type Shape = typeof SHAPE.DEFAULT | typeof SHAPE.ROUND;

export type StyledRootProps = {
  $shape: Shape;
};
export type StyledArtworkContainerProps = {
  $artworkSize: ArtworkSizes | number;
  $sublist?: boolean;
};
export type StyledContentProps = {
  $mLeft: boolean;
  $sublist: boolean;
};

export type ListOverrides = {
  Root?: Override;
  ArtworkContainer?: Override;
  Content?: Override;
  EndEnhancerContainer?: Override;
};

export type ListProps = {
  artwork?: React.ComponentType<
    {
      size: IconProps['size'];
    } & IconProps
  >;
  artworkSize?: ArtworkSizes | number;
  shape?: Shape;
  children: React.ReactNode;
  endEnhancer?: React.ComponentType<{}>;
  'aria-label'?: string;
  'aria-selected'?: boolean;
  id?: String;
  overrides?: ListOverrides;
  role?: string;
  sublist?: boolean;
};

export type LabelOverrides = {
  LabelContent?: Override;
  LabelDescription?: Override;
  LabelSublistContent?: Override;
};

export type LabelProps = {
  children: React.ReactNode;
  description?: React.ReactNode;
  sublist?: boolean;
  overrides?: LabelOverrides;
};

export type HeadingOverrides = {
  Root?: Override;
  Content?: Override;
  HeadingContainer?: Override;
  SubHeadingContainer?: Override;
  EndEnhancerContainer?: Override;
  EndEnhancerDescriptionContainer?: Override;
};

export type HeadingProps = {
  heading: React.ReactNode | React.ComponentType<{}>;
  subHeading?: React.ReactNode | React.ComponentType<{}>;
  endEnhancer?: React.ReactNode | React.ComponentType<{}>;
  endEnhancerDescription?: React.ReactNode | React.ComponentType<{}>;
  overrides?: HeadingOverrides;
  maxLines?: 1 | 2;
};

export type StyledHeadingHeadingProps = {
  $maxLines: number;
};

export type MenuAdapterProps = {
  item?: any;
  onMouseEnter?: (a: MouseEvent) => unknown;
  onClick?: (a: MouseEvent) => unknown;
  $size?: string;
  $isHighlighted?: boolean;
  $disabled?: boolean;
} & ListProps;
