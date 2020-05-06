import { TimeUnit } from './time-unit';
import { HourMode } from '../types';

export class Hour extends TimeUnit {
  private static readonly DEFAULT_STEP = 1;
  private static readonly MAX = 24;

  constructor(value: number, step = Hour.DEFAULT_STEP, private hourMode: HourMode) {
    super(value, step, Hour.MAX);
  }

  get maxValue(): number {
    return this.hourMode || Hour.MAX;
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
