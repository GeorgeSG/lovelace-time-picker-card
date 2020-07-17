import { Hour } from './hour';
import { Minute } from './minute';
import { Direction } from '../types';

export class Time {
  constructor(public hour: Hour, public minute: Minute, private _linkValues: boolean = false) {}

  hourStep(direction: Direction): void {
    this.hour.stepUpdate(direction);
  }

  minuteStep(direction: Direction): void {
    if (this._linkValues && this.minute.willOverflow(direction)) {
      this.hour.stepUpdate(direction, 1);
    }

    this.minute.stepUpdate(direction);
  }

  get value(): string {
    return `${this.hour.value}:${this.minute.value}`;
  }
}
