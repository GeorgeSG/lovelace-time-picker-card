import { DEFAULT_MINUTE_STEP } from '../const';
import { TimeUnit } from './time-unit';
import { Direction } from '../types';

/**
 * * Represents the minute value of a datetime.
 */
export class Minute extends TimeUnit {
  private static readonly VALUE_LIMIT = 60;

  minValue = 0;
  maxValue = Minute.VALUE_LIMIT - 1;

  constructor(value: number, step = DEFAULT_MINUTE_STEP) {
    super(value, step, Minute.VALUE_LIMIT);
  }

  /**
   * Returns true if the minutes will overflow to a different hour when changed in {@param direction}.
   * @param direction
   */
  willOverflow(direction: Direction): boolean {
    const newValue = direction === Direction.UP ? this.value + this._step : this.value - this._step;
    return newValue >= this._limit || newValue < 0;
  }
}
