import { TimeUnit } from './time-unit';

export class Minute extends TimeUnit {
  private static readonly DEFAULT_STEP = 5;
  private static readonly MAX = 60;

  maxValue = Minute.MAX;

  constructor(value: number, step = Minute.DEFAULT_STEP) {
    super(value, step, Minute.MAX);
  }

  protected isValidString(valueStr: string): boolean {
    const value = parseInt(valueStr);
    return !isNaN(value) && value >= 0 && value <= this._limit;
  }
}
