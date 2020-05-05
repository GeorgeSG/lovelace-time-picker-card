import { TimeUnit } from './time-unit';

export class Hour extends TimeUnit {
  private static readonly DEFAULT_STEP = 1;
  private static readonly MAX = 24;

  constructor(value: number, step = Hour.DEFAULT_STEP) {
    super(value, step, Hour.MAX);
  }
}
