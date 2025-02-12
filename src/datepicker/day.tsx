/*
Copyright (c) Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from 'react';
import { StyledDay, StyledDayLabel } from './styled-components';
import dateFnsAdapter from './utils/date-fns-adapter';
import DateHelpers from './utils/date-helpers';
import { getOverrides } from '../helpers/overrides';
import type { DayProps, DayState } from './types';
import { LocaleContext } from '../locale';
import type { Locale } from '../locale';
import { isFocusVisible } from '../utils/focusVisible';
import { INPUT_ROLE } from './constants';

export default class Day<T = Date> extends React.Component<DayProps<T>, DayState> {
  static defaultProps = {
    disabled: false,
    highlighted: false,
    range: false,
    adapter: dateFnsAdapter,
    onClick: () => {},
    onSelect: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onMouseOver: () => {},
    onMouseLeave: () => {},
    overrides: {},
    peekNextMonth: true,
    value: null,
  };

  dayElm: HTMLElement;

  state = {
    isHovered: false,
    isFocusVisible: false,
  };

  dateHelpers: DateHelpers<T>;

  constructor(props: DayProps<T>) {
    super(props);
    this.dateHelpers = new DateHelpers(props.adapter);
  }

  componentDidMount() {
    if (this.dayElm && this.props.focusedCalendar) {
      if (this.props.highlighted || (!this.props.highlightedDate && this.isSelected())) {
        this.dayElm.focus();
      }
    }
  }

  componentDidUpdate(prevProps: DayProps<T>) {
    if (this.dayElm && this.props.focusedCalendar) {
      if (this.props.highlighted || (!this.props.highlightedDate && this.isSelected())) {
        this.dayElm.focus();
      }
    }
  }

  getDateProp: () => T = () => {
    return this.props.date === undefined ? this.dateHelpers.date() : this.props.date;
  };

  getMonthProp: () => number = () => {
    return this.props.month === undefined || this.props.month === null
      ? this.dateHelpers.getMonth(this.getDateProp())
      : this.props.month;
  };

  /**
   * Determines how the day value(s) should be updated when a new day is selected.
   * Note: time values are incorporated into new day/date values downstream in `Calendar`.
   * Note: Situations where Start Dates are after End Dates are handled downstream in `Datepicker`.
   * */
  onSelect: (a: T) => void = (selectedDate) => {
    const { range, value } = this.props;

    let nextDate;
    if (Array.isArray(value) && range && this.props.hasLockedBehavior) {
      const currentDate = this.props.value;
      let nextStartDate = null;
      let nextEndDate = null;

      if (this.props.selectedInput === INPUT_ROLE.startDate) {
        nextStartDate = selectedDate;
        nextEndDate = Array.isArray(currentDate) && currentDate[1] ? currentDate[1] : null;
      } else if (this.props.selectedInput === INPUT_ROLE.endDate) {
        nextStartDate = Array.isArray(currentDate) && currentDate[0] ? currentDate[0] : null;
        nextEndDate = selectedDate;
      }

      nextDate = [nextStartDate];
      if (nextEndDate) {
        nextDate.push(nextEndDate);
      }
    } else if (Array.isArray(value) && range && !this.props.hasLockedBehavior) {
      const [start, end] = value;

      // Starting a new range
      if ((!start && !end) || (start && end)) {
        nextDate = [selectedDate, null];

        // EndDate needs a StartDate, SelectedDate comes before EndDate
      } else if (!start && end && this.dateHelpers.isAfter(end, selectedDate)) {
        nextDate = [selectedDate, end];

        // EndDate needs a StartDate, but SelectedDate comes after EndDate
      } else if (!start && end && this.dateHelpers.isAfter(selectedDate, end)) {
        nextDate = [end, selectedDate];

        // StartDate needs an EndDate, SelectedDate comes after StartDate
      } else if (start && !end && this.dateHelpers.isAfter(selectedDate, start)) {
        nextDate = [start, selectedDate];
      } else {
        nextDate = [selectedDate, start];
      }
    } else {
      nextDate = selectedDate;
    }

    this.props.onSelect({ date: nextDate });
  };

  onKeyDown = (event: KeyboardEvent) => {
    const date = this.getDateProp();
    const { highlighted, disabled } = this.props;
    if (event.key === 'Enter' && highlighted && !disabled) {
      event.preventDefault();
      this.onSelect(date);
    }
  };

  onClick = (event: Event) => {
    const date = this.getDateProp();
    const { disabled } = this.props;
    if (!disabled) {
      this.props.onClick({ event, date });
      this.onSelect(date);
    }
  };

  onFocus = (event: Event) => {
    if (isFocusVisible(event)) {
      this.setState({ isFocusVisible: true });
    }
    this.props.onFocus({ event, date: this.getDateProp() });
  };

  onBlur = (event: Event) => {
    if (this.state.isFocusVisible !== false) {
      this.setState({ isFocusVisible: false });
    }
    this.props.onBlur({ event, date: this.getDateProp() });
  };

  onMouseOver = (event: Event) => {
    this.setState({ isHovered: true });
    this.props.onMouseOver({ event, date: this.getDateProp() });
  };

  onMouseLeave = (event: Event) => {
    this.setState({ isHovered: false });
    this.props.onMouseLeave({ event, date: this.getDateProp() });
  };

  isOutsideMonth = () => {
    const month = this.getMonthProp();
    return month !== undefined && month !== this.dateHelpers.getMonth(this.getDateProp());
  };

  getOrderedDates: () => T[] = () => {
    const { highlightedDate, value } = this.props;
    if (!value || !Array.isArray(value) || !value[0] || (!value[1] && !highlightedDate)) {
      return [];
    }
    const firstValue = value[0];
    const secondValue = value.length > 1 && value[1] ? value[1] : highlightedDate;
    if (!firstValue || !secondValue) {
      return [];
    }
    const firstDate = this.clampToDayStart(firstValue);
    const secondDate = this.clampToDayStart(secondValue);
    return this.dateHelpers.isAfter(firstDate, secondDate)
      ? [secondDate, firstDate]
      : [firstDate, secondDate];
  };

  isOutsideOfMonthButWithinRange = () => {
    const date = this.clampToDayStart(this.getDateProp());
    const dates = this.getOrderedDates();
    if (dates.length < 2 || this.dateHelpers.isSameDay(dates[0], dates[1])) {
      return false;
    }
    const day = this.dateHelpers.getDate(date);
    /**
     * Empty days (no number label) at the beginning/end of the month should be included
     * within the range if the last day of a month and the first day of the next month are
     * within the range.
     */
    if (day > 15) {
      const firstDayOfNextMonth = this.clampToDayStart(
        this.dateHelpers.addDays(this.dateHelpers.getEndOfMonth(date), 1)
      );
      return (
        this.dateHelpers.isOnOrBeforeDay(dates[0], this.dateHelpers.getEndOfMonth(date)) &&
        this.dateHelpers.isOnOrAfterDay(dates[1], firstDayOfNextMonth)
      );
    } else {
      const lastDayOfPreviousMonth = this.clampToDayStart(
        this.dateHelpers.subDays(this.dateHelpers.getStartOfMonth(date), 1)
      );
      return (
        this.dateHelpers.isOnOrAfterDay(dates[1], this.dateHelpers.getStartOfMonth(date)) &&
        this.dateHelpers.isOnOrBeforeDay(dates[0], lastDayOfPreviousMonth)
      );
    }
  };

  isSelected() {
    const date = this.getDateProp();
    const { value } = this.props;
    if (Array.isArray(value)) {
      return (
        this.dateHelpers.isSameDay(date, value[0]) || this.dateHelpers.isSameDay(date, value[1])
      );
    } else {
      return this.dateHelpers.isSameDay(date, value);
    }
  }

  clampToDayStart: (a: T) => T = (dt) => {
    const { setSeconds, setMinutes, setHours } = this.dateHelpers;
    return setSeconds(setMinutes(setHours(dt, 0), 0), 0);
  };

  // calculated for range case only
  isPseudoSelected() {
    const date = this.getDateProp();
    const { value } = this.props;

    if (Array.isArray(value)) {
      const [start, end] = value;

      if (!start && !end) {
        return false;
      }

      if (start && end) {
        return this.dateHelpers.isDayInRange(
          this.clampToDayStart(date),
          this.clampToDayStart(start),
          this.clampToDayStart(end)
        );
      }
    }
  }

  // calculated for range case only
  isPseudoHighlighted() {
    const date = this.getDateProp();
    const { value, highlightedDate } = this.props;

    if (Array.isArray(value)) {
      const [start, end] = value;

      if (!start && !end) {
        return false;
      }

      if (highlightedDate && start && !end) {
        if (this.dateHelpers.isAfter(highlightedDate, start)) {
          return this.dateHelpers.isDayInRange(
            this.clampToDayStart(date),
            this.clampToDayStart(start),
            this.clampToDayStart(highlightedDate)
          );
        } else {
          return this.dateHelpers.isDayInRange(
            this.clampToDayStart(date),
            this.clampToDayStart(highlightedDate),
            this.clampToDayStart(start)
          );
        }
      }

      if (highlightedDate && !start && end) {
        if (this.dateHelpers.isAfter(highlightedDate, end)) {
          return this.dateHelpers.isDayInRange(
            this.clampToDayStart(date),
            this.clampToDayStart(end),
            this.clampToDayStart(highlightedDate)
          );
        } else {
          return this.dateHelpers.isDayInRange(
            this.clampToDayStart(date),
            this.clampToDayStart(highlightedDate),
            this.clampToDayStart(end)
          );
        }
      }
    }
  }

  getSharedProps() {
    const date = this.getDateProp();
    const { value, highlightedDate, range, highlighted, peekNextMonth } = this.props;
    const $isHighlighted = highlighted;
    const $selected = this.isSelected();
    const $hasRangeHighlighted = !!(
      Array.isArray(value) &&
      range &&
      highlightedDate &&
      ((value[0] && !value[1] && !this.dateHelpers.isSameDay(value[0], highlightedDate)) ||
        (!value[0] && value[1] && !this.dateHelpers.isSameDay(value[1], highlightedDate)))
    );
    const $outsideMonth = !peekNextMonth && this.isOutsideMonth();
    const $outsideMonthWithinRange = !!(
      Array.isArray(value) &&
      range &&
      $outsideMonth &&
      !peekNextMonth &&
      this.isOutsideOfMonthButWithinRange()
    );
    return {
      $date: date,
      $density: this.props.density,
      $disabled: this.props.disabled,
      $endDate:
        (Array.isArray(value) &&
          !!(value[0] && value[1]) &&
          range &&
          $selected &&
          this.dateHelpers.isSameDay(date, value[1])) ||
        false,
      $hasDateLabel: !!this.props.dateLabel,
      $hasRangeHighlighted,
      $hasRangeOnRight:
        Array.isArray(value) &&
        $hasRangeHighlighted &&
        highlightedDate &&
        ((value[0] && this.dateHelpers.isAfter(highlightedDate, value[0])) ||
          (value[1] && this.dateHelpers.isAfter(highlightedDate, value[1]))),
      $hasRangeSelected: Array.isArray(value) ? !!(value[0] && value[1]) : false,
      $highlightedDate: highlightedDate,
      $isHighlighted,
      $isHovered: this.state.isHovered,
      $isFocusVisible: this.state.isFocusVisible,
      $startOfMonth: this.dateHelpers.isStartOfMonth(date),
      $endOfMonth: this.dateHelpers.isEndOfMonth(date),
      $month: this.getMonthProp(),
      $outsideMonth,
      $outsideMonthWithinRange,
      $peekNextMonth: peekNextMonth,
      $pseudoHighlighted:
        range && !$isHighlighted && !$selected ? this.isPseudoHighlighted() : false,
      $pseudoSelected: range && !$selected ? this.isPseudoSelected() : false,
      $range: range,
      $selected,
      $startDate:
        Array.isArray(value) && value[0] && value[1] && range && $selected
          ? this.dateHelpers.isSameDay(date, value[0])
          : false,
      $hasLockedBehavior: this.props.hasLockedBehavior,
      $selectedInput: this.props.selectedInput,
      $value: this.props.value,
    };
  }

  getAriaLabel(
    sharedProps: {
      $disabled: boolean;
      $range: boolean;
      $selected: boolean;
      $startDate: boolean;
      $endDate: boolean;
    },
    localeContext: Locale
  ) {
    const date = this.getDateProp();
    return `${
      sharedProps.$selected
        ? sharedProps.$range
          ? sharedProps.$endDate
            ? localeContext.datepicker.selectedEndDateLabel
            : localeContext.datepicker.selectedStartDateLabel
          : localeContext.datepicker.selectedLabel
        : sharedProps.$disabled
        ? localeContext.datepicker.dateNotAvailableLabel
        : localeContext.datepicker.chooseLabel
    } ${this.dateHelpers.format(date, 'fullOrdinalWeek', this.props.locale)}. ${
      !sharedProps.$disabled ? localeContext.datepicker.dateAvailableLabel : ''
    }`;
  }

  render() {
    const date = this.getDateProp();
    const { peekNextMonth, overrides = {} } = this.props;
    const sharedProps = this.getSharedProps();
    const [Day, dayProps] = getOverrides(overrides.Day, StyledDay);
    const [DayLabel, dayLabelProps] = getOverrides(overrides.DayLabel, StyledDayLabel);
    const dateLabel = this.props.dateLabel && this.props.dateLabel(date);
    return !peekNextMonth && sharedProps.$outsideMonth ? (
      <Day
        role="gridcell"
        {...sharedProps}
        {...dayProps}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
    ) : (
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      <LocaleContext.Consumer>
        {(locale: Locale) => (
          <Day
            aria-label={this.getAriaLabel(sharedProps, locale)}
            ref={(dayElm) => {
              this.dayElm = dayElm;
            }}
            role="gridcell"
            aria-roledescription="button"
            tabIndex={
              this.props.highlighted || (!this.props.highlightedDate && this.isSelected()) ? 0 : -1
            }
            {...sharedProps}
            {...dayProps}
            // Adding event handlers after customers overrides in order to
            // make sure the components functions as expected
            // We can extract the handlers from props overrides
            // and call it along with internal handlers by creating an inline handler
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onClick={this.onClick}
            onKeyDown={this.onKeyDown}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseLeave}
          >
            <div>{this.dateHelpers.getDate(date)}</div>
            {dateLabel ? (
              <DayLabel {...sharedProps} {...dayLabelProps}>
                {dateLabel}
              </DayLabel>
            ) : null}
          </Day>
        )}
      </LocaleContext.Consumer>
    );
  }
}
