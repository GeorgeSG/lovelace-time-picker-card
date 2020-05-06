import { DEFAULT_MINUTE_STEP } from '../const';
import { TimeUnit } from './time-unit';

/**
 * * Represents the minute value of a datetime.
 */
export class Minute extends TimeUnit {
  private static readonly VALUE_LIMIT = 60;

  maxValue = Minute.VALUE_LIMIT;

  constructor(value: number, step = DEFAULT_MINUTE_STEP) {
    super(value, step, Minute.VALUE_LIMIT);
  }

  protected isValidString(valueStr: string): boolean {
    const value = parseInt(valueStr);
    return !isNaN(value) && value >= 0 && value <= this._limit;
  }
}
