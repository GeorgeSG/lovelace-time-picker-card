export interface TimePickerCardConfig {
  entity: string;
  hour_step?: number;
  minute_step?: number;
}

export enum Direction {
  UP = 'up',
  DOWN = 'down',
}
