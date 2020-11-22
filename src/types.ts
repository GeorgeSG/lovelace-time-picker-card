import { LovelaceCardConfig } from 'custom-card-helpers';

export interface TimePickerCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  link_values?: boolean;
  hour_mode?: HourMode;
  hour_step?: number;
  minute_step?: number;
  second_step?: number;
  layout?: TimePickerLayoutConfig;
  hide?: TimePickerHideConfig;
}

export type HourMode = 12 | 24 | undefined;

export interface TimePickerLayoutConfig {
  align_controls?: Layout.AlignControls;
  name?: Layout.Name;
  hour_mode?: Layout.HourMode;
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
