import { LovelaceCardConfig } from 'custom-card-helpers';

export interface TimePickerCardConfig extends LovelaceCardConfig {
  entity: string;
  hour_step?: number;
  minute_step?: number;
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
}
