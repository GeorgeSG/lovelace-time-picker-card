import { DEFAULT_MINUTE_STEP } from '../const';
import { TimeUnit } from './time-unit';

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
}
