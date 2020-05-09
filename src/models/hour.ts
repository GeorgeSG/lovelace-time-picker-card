import { DEFAULT_HOUR_STEP } from '../const';
import { HourMode } from '../types';
import { TimeUnit } from './time-unit';

/**
 * Represents the hour value of a datetime.
 */
export class Hour extends TimeUnit {
  private static readonly VALUE_LIMIT = 24;

  constructor(value: number, step = DEFAULT_HOUR_STEP, private hourMode?: HourMode) {
    super(value, step, Hour.VALUE_LIMIT);
  }

  get minValue(): number {
    return this.hourMode === 12 ? 1 : 0; // there is no 00:00 AM -> it's 12:00 AM.
  }

  get maxValue(): number {
    return this.hourMode === 12 ? 12 : Hour.VALUE_LIMIT - 1;
  }

  togglePeriod(): void {
    this.setValue(this.value + 12);
  }

  toString(): string {
    let value;

    if (this.hourMode === 12) {
      value = (this.value + 12) % 12;
      value = value === 0 ? 12 : value;
    } else {
      value = this.value;
    }

    return value < 10 ? `0${value}` : value.toString();
  }
}
