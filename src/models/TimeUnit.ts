import { Direction } from '../types';

export abstract class TimeUnit {
  constructor(private _value: number, private _step: number, private _limit: number) {}

  get value(): number {
    return this._value;
  }

  setStringValue(stringValue: string): void {
    if (this.isValidString(stringValue)) {
      this.setValue(parseInt(stringValue));
    }
  }

  stepUpdate(direction: Direction): void {
    direction === Direction.UP ? this.increment() : this.decrement();
  }

  increment(): void {
    this.setValue(this.value + this._step);
  }

  decrement(): void {
    this.setValue(this.value - this._step);
  }

  toString(): string {
    return this.value < 10 ? `0${this.value}` : this.value.toString();
  }

  private isValidString(valueStr: string): boolean {
    const value = parseInt(valueStr);
    return !isNaN(value) && value >= 0 && value <= this._limit;
  }

  private setValue(newValue: number): void {
    if (newValue >= this._limit || newValue < 0) {
      newValue = (newValue + this._limit) % this._limit;
    }

    this._value = newValue;
  }
}
