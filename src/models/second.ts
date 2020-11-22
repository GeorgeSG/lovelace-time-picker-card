import { DEFAULT_SECOND_STEP } from '../const';
import { TimeUnit } from './time-unit';
import { Direction } from '../types';

/**
 * * Represents the second value of a datetime.
 */
export class Second extends TimeUnit {
  private static readonly VALUE_LIMIT = 60;

  minValue = 0;
  maxValue = Second.VALUE_LIMIT - 1;

  constructor(value: number, step = DEFAULT_SECOND_STEP) {
    super(value, step, Second.VALUE_LIMIT);
  }

  /**
   * Returns true if the seconds will overflow to a different hour when changed in {@param direction}.
   * @param direction
   */
  willOverflow(direction: Direction): boolean {
    const newValue = direction === Direction.UP ? this.value + this._step : this.value - this._step;
    return newValue >= this._limit || newValue < 0;
  }
}
