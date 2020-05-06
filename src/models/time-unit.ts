import { Direction } from '../types';

export abstract class TimeUnit {
  /**
   * Return true if the valueStr can be set as a value of this instance.
   */
  protected abstract isValidString(valueStr: string): boolean;

  /**
   * The max allowed value for this instance. Used for UI validation.
   */
  abstract maxValue: number;

  /**
   * Create a new instance of a TimeUnit
   * @param _value current value
   * @param _step how much to increase / decrease the value when step-changing
   * @param _limit value upper limit
   */
  constructor(private _value: number, protected _step: number, protected _limit: number) {}

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

  protected setValue(newValue: number): void {
    if (newValue >= this._limit || newValue < 0) {
      newValue = (newValue + this._limit) % this._limit;
    }

    this._value = newValue;
  }
}
