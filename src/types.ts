import { LovelaceCardConfig } from 'custom-card-helpers';

export interface TimePickerCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  hour_mode?: HourMode;
  hour_step?: number;
  minute_step?: number;
  hide?: TimePickerHideConfig;
}

export interface TimePickerHideConfig {
  name: boolean;
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
}

export enum Period {
  AM = 'am',
  PM = 'pm',
}

export type HourMode = 12 | 24 | undefined;
