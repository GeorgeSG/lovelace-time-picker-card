import { DEFAULT_HOUR_STEP } from '../const';
import { HourMode } from '../types';
import { TimeUnit } from './time-unit';

/**
 * Represents the hour value of a datetime.
 */
export class Hour extends TimeUnit {
  private static readonly VALUE_LIMIT = 24;

  constructor(value: number, step = DEFAULT_HOUR_STEP, private hourMode: HourMode) {
    super(value, step, Hour.VALUE_LIMIT);
  }

  get maxValue(): number {
    return this.hourMode || Hour.VALUE_LIMIT;
  }

  togglePeriod(): void {
    this.setValue(this.value + 12);
  }

  toString(): string {
    const value = this.hourMode === 12 ? (this.value + 12) % 12 : this.value;

    return value < 10 ? `0${value}` : value.toString();
  }

  protected isValidString(valueStr: string): boolean {
    const value = parseInt(valueStr);
    const limit = this.hourMode || this._limit;

    return !isNaN(value) && value >= 0 && value <= limit;
  }
}
