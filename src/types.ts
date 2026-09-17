import { ActionConfig, LovelaceCardConfig } from 'custom-card-helpers';

export interface TimePickerCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: EntityName;
  link_values?: boolean;
  hour_mode?: HourMode;
  hour_step?: number;
  minute_step?: number;
  second_step?: number;
  delay?: number;
  layout?: TimePickerLayoutConfig;
  hide?: TimePickerHideConfig;
  tap_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  hold_action?: ActionConfig;
}

/** A `name` option: a plain string, or name parts resolved from the registry. */
export type EntityName = string | EntityNameItem | EntityNameItem[];

export type EntityNameItem =
  | { type: 'entity' | 'device' | 'area' | 'floor' }
  | { type: 'text'; text: string };

export type HourMode = 12 | 24 | undefined;

export interface TimePickerLayoutConfig {
  align_controls?: Layout.AlignControls;
  name?: Layout.Name;
  hour_mode?: Layout.HourMode;
  embedded?: boolean;
  thin?: boolean;
}

export namespace Layout {
  export type HourMode = 'single' | 'double';

  export enum AlignControls {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
  }

  export enum Name {
    HEADER = 'header',
    INSIDE = 'inside',
  }
}

export interface TimePickerHideConfig {
  name?: boolean;
  icon?: boolean;
  seconds?: boolean;
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
}

export enum Period {
  AM = 'AM',
  PM = 'PM',
}
