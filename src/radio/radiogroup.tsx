/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';

import { getOverrides } from '../helpers/overrides';

import { RadioGroupRoot as StyledRadioGroupRoot } from './styled-components';
import type { RadioGroupProps, DefaultProps, StatelessState } from './types';
import { isFocusVisible } from '../utils/focusVisible';

import type { ChangeEvent } from 'react';

class StatelessRadioGroup extends React.Component<RadioGroupProps, StatelessState> {
  static defaultProps: DefaultProps = {
    name: '',
    value: '',
    disabled: false,
    autoFocus: false,
    labelPlacement: 'right',
    align: 'vertical',
    error: false,
    required: false,
    onChange: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onFocus: () => {},
    onBlur: () => {},
    overrides: {},
  };

  state = { isFocusVisible: false, focusedRadioIndex: -1 };

  handleFocus = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    if (isFocusVisible(event)) {
      this.setState({ isFocusVisible: true });
    }
    this.setState({ focusedRadioIndex: index });
    this.props.onFocus && this.props.onFocus(event);
  };

  handleBlur = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    if (this.state.isFocusVisible !== false) {
      this.setState({ isFocusVisible: false });
    }
    this.setState({ focusedRadioIndex: -1 });
    this.props.onBlur && this.props.onBlur(event);
  };

  render() {
    const { overrides = {} } = this.props;
    const [RadioGroupRoot, radioGroupRootProps] = getOverrides(
      overrides.RadioGroupRoot,
      StyledRadioGroupRoot
    );

    return (
      <RadioGroupRoot
        id={this.props.id}
        role="radiogroup"
        aria-describedby={this.props['aria-describedby']}
        aria-errormessage={this.props['aria-errormessage']}
        aria-invalid={this.props.error || null}
        aria-label={this.props['aria-label']}
        aria-labelledby={this.props['aria-labelledby']}
        $align={this.props.align}
        $disabled={this.props.disabled}
        $error={this.props.error}
        $required={this.props.required}
        {...radioGroupRootProps}
      >
        {React.Children.map(this.props.children, (child, index) => {
          if (!React.isValidElement(child)) {
            return null;
          }
          const checked = this.props.value === child.props.value;
          return React.cloneElement(child, {
            align: this.props.align,
            autoFocus: this.props.autoFocus,
            checked,
            disabled: this.props.disabled || child.props.disabled,
            error: this.props.error,
            isFocused: this.state.focusedRadioIndex === index,
            isFocusVisible: this.state.isFocusVisible,
            tabIndex: (index === 0 && !this.props.value) || checked ? '0' : '-1',
            labelPlacement: this.props.labelPlacement,
            name: this.props.name,
            onBlur: (e: ChangeEvent<HTMLInputElement>) => this.handleBlur(e, index),
            onFocus: (e: ChangeEvent<HTMLInputElement>) => this.handleFocus(e, index),
            onChange: this.props.onChange,
            onMouseEnter: this.props.onMouseEnter,
            onMouseLeave: this.props.onMouseLeave,
          });
        })}
      </RadioGroupRoot>
    );
  }
}

export default StatelessRadioGroup;
