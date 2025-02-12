/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';

import { StyledLink } from '../link';
import { useStyletron } from '../styles';

import Column from './column';
import { COLUMNS } from './constants';
import type { ColumnOptions, SharedColumnOptions } from './types';

type Value = {
  content: string;
  href: string;
};

type ReplacementElementAs = React.ComponentType<{
  href: string;
  children: string;
}>;

type Options = {
  elementAs?: ReplacementElementAs | string;
} & SharedColumnOptions<Value>;

type FilterParameters = {};
type AnchorColumn = ColumnOptions<Value, FilterParameters>;

function AnchorFilter(props) {
  return <div>not implemented for anchor column</div>;
}

function AnchorCell(props) {
  const [css] = useStyletron();
  return (
    <div
      className={css({
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      })}
    >
      <StyledLink $as={props.elementAs} href={props.value.href}>
        {props.value.content}
      </StyledLink>
    </div>
  );
}

function AnchorColumn(options: Options): AnchorColumn {
  return Column({
    kind: COLUMNS.ANCHOR,
    buildFilter: function (params) {
      return function (data) {
        return true;
      };
    },
    cellBlockAlign: options.cellBlockAlign,
    fillWidth: options.fillWidth,
    filterable: false,
    mapDataToValue: options.mapDataToValue,
    maxWidth: options.maxWidth,
    minWidth: options.minWidth,
    renderCell: function RenderAnchorCell(props) {
      return <AnchorCell {...props} elementAs={options.elementAs} />;
    },
    renderFilter: AnchorFilter,
    sortable: options.sortable === undefined ? true : options.sortable,
    sortFn: function (a, b) {
      return a.content.localeCompare(b.content);
    },
    title: options.title,
  });
}

export default AnchorColumn;
