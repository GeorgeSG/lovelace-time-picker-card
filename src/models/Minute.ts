import { TimeUnit } from './TimeUnit';

export class Minute extends TimeUnit {
  private static readonly DEFAULT_STEP = 5;
  private static readonly MAX = 50;

  constructor(value: number, step = Minute.DEFAULT_STEP) {
    super(value, step, Minute.MAX);
  }
}
