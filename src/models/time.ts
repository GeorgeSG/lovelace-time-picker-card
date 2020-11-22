import { Direction } from '../types';
import { Hour } from './hour';
import { Minute } from './minute';
import { Second } from './second';

export class Time {
  constructor(
    public hour: Hour,
    public minute: Minute,
    public second: Second,
    private _linkValues: boolean = false
  ) {}

  hourStep(direction: Direction): void {
    this.hour.stepUpdate(direction);
  }

  minuteStep(direction: Direction): void {
    if (this._linkValues && this.minute.willOverflow(direction)) {
      this.hour.stepUpdate(direction, 1);
    }

    this.minute.stepUpdate(direction);
  }

  secondStep(direction: Direction): void {
    if (this._linkValues && this.second.willOverflow(direction)) {
      this.minute.stepUpdate(direction, 1);
    }

    this.second.stepUpdate(direction);
  }

  get value(): string {
    return `${this.hour.value}:${this.minute.value}:${this.second.value}`;
  }
}
