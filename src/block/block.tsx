/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

import * as React from 'react';
import type { BlockComponentType, BlockProps, StyledBlockProps } from './types';
import { StyledBlock } from './styled-components';
import { getOverrides } from '../helpers/overrides';

const Block: React.FC<
  BlockProps & { forwardedRef?: React.Ref<HTMLElement> } & Omit<
      StyledBlockProps & JSX.IntrinsicElements['div'],
      keyof BlockProps
    >
> = ({
  forwardedRef,
  children,
  as = 'div',
  overrides = {},
  color,
  backgroundAttachment,
  backgroundClip,
  backgroundColor,
  backgroundImage,
  backgroundOrigin,
  backgroundPosition,
  backgroundRepeat,
  backgroundSize,
  font,
  alignContent,
  alignItems,
  alignSelf,
  flexDirection,
  display,
  flex,
  grid,
  gridArea,
  gridAutoColumns,
  gridAutoFlow,
  gridAutoRows,
  gridColumn,
  gridColumnEnd,
  gridColumnGap,
  gridColumnStart,
  gridGap,
  gridRow,
  gridRowEnd,
  gridRowGap,
  gridRowStart,
  gridTemplate,
  gridTemplateAreas,
  gridTemplateColumns,
  gridTemplateRows,
  justifyContent,
  justifyItems,
  justifySelf,
  position,
  width,
  minWidth,
  maxWidth,
  height,
  minHeight,
  maxHeight,
  overflow,
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  placeContent,
  placeItems,
  placeSelf,
  flexWrap,
  left,
  top,
  right,
  bottom,
  textOverflow,
  whiteSpace,
  ...restProps
}) => {
  const [BaseBlock, baseBlockProps] = getOverrides(overrides.Block, StyledBlock);

  return (
    <BaseBlock
      // coerced to any because because of how react components are typed.
      // cannot guarantee an html element
      ref={forwardedRef as any}
      $as={as}
      $color={color}
      $backgroundAttachment={backgroundAttachment}
      $backgroundClip={backgroundClip}
      $backgroundColor={backgroundColor}
      $backgroundImage={backgroundImage}
      $backgroundOrigin={backgroundOrigin}
      $backgroundPosition={backgroundPosition}
      $backgroundRepeat={backgroundRepeat}
      $backgroundSize={backgroundSize}
      $font={font}
      $alignContent={alignContent}
      $alignItems={alignItems}
      $alignSelf={alignSelf}
      $flexDirection={flexDirection}
      $display={display}
      $flex={flex}
      $grid={grid}
      $gridArea={gridArea}
      $gridAutoColumns={gridAutoColumns}
      $gridAutoFlow={gridAutoFlow}
      $gridAutoRows={gridAutoRows}
      $gridColumn={gridColumn}
      $gridColumnEnd={gridColumnEnd}
      $gridColumnGap={gridColumnGap}
      $gridColumnStart={gridColumnStart}
      $gridGap={gridGap}
      $gridRow={gridRow}
      $gridRowEnd={gridRowEnd}
      $gridRowGap={gridRowGap}
      $gridRowStart={gridRowStart}
      $gridTemplate={gridTemplate}
      $gridTemplateAreas={gridTemplateAreas}
      $gridTemplateColumns={gridTemplateColumns}
      $gridTemplateRows={gridTemplateRows}
      $justifyContent={justifyContent}
      $justifyItems={justifyItems}
      $justifySelf={justifySelf}
      $position={position}
      $width={width}
      $minWidth={minWidth}
      $maxWidth={maxWidth}
      $height={height}
      $minHeight={minHeight}
      $maxHeight={maxHeight}
      $overflow={overflow}
      $margin={margin}
      $marginTop={marginTop}
      $marginRight={marginRight}
      $marginBottom={marginBottom}
      $marginLeft={marginLeft}
      $padding={padding}
      $paddingTop={paddingTop}
      $paddingRight={paddingRight}
      $paddingBottom={paddingBottom}
      $paddingLeft={paddingLeft}
      $placeContent={placeContent}
      $placeItems={placeItems}
      $placeSelf={placeSelf}
      $flexWrap={flexWrap}
      $left={left}
      $top={top}
      $right={right}
      $bottom={bottom}
      $textOverflow={textOverflow}
      $whiteSpace={whiteSpace}
      data-baseweb="block"
      {...restProps}
      {...baseBlockProps}
    >
      {children}
    </BaseBlock>
  );
};

const BlockComponent = React.forwardRef<any, any>((props, ref) => (
  <Block {...props} forwardedRef={ref} />
)) as BlockComponentType<'div'>;

BlockComponent.displayName = 'Block';
export default BlockComponent;
