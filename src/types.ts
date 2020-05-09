import { LovelaceCardConfig } from 'custom-card-helpers';

export interface TimePickerCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  hour_mode?: HourMode;
  hour_step?: number;
  minute_step?: number;
  layout?: TimePickerLayoutConfig;
  hide?: TimePickerHideConfig;
}

export type HourMode = 12 | 24 | undefined;

export interface TimePickerLayoutConfig {
  align?: LayoutAlign;
  hour_mode?: LayoutHourMode;
}

export type LayoutHourMode = 'single' | 'double';
export type LayoutAlign = 'left' | 'center' | 'right';

export interface TimePickerHideConfig {
  name?: boolean;
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
}

export enum Period {
  AM = 'AM',
  PM = 'PM',
}
