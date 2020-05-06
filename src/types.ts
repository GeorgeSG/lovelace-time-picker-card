import { LovelaceCardConfig } from 'custom-card-helpers';

export interface TimePickerCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
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
