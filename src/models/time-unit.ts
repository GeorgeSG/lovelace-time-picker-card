import { Direction } from '../types';

/**
 * Represents a single unit of a datetime oobject - e.g. hours or minutes.
 */
export abstract class TimeUnit {
  /**
   * The min allowed UI value for this instance.
   */
  abstract minValue: number;
  /**
   * The max allowed value for this instance.
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

  /**
   * Sets a value from {@param stringValue}, if it can be parsed and is valid.
   * @param stringValue
   */
  setStringValue(stringValue: string): void {
    if (this.isValidString(stringValue)) {
      this.setValue(parseInt(stringValue));
    }
  }

  /**
   * Updates the value in {@param direction} by the step size specified in the constructoor.
   * @param direction
   */
  stepUpdate(direction: Direction, step: number = this._step): void {
    direction === Direction.UP ? this.increment(step) : this.decrement(step);
  }

  toString(): string {
    return this.value < 10 ? `0${this.value}` : this.value.toString();
  }

  private increment(step: number = this._step): void {
    this.setValue(this.value + step);
  }

  private decrement(step: number = this._step): void {
    this.setValue(this.value - step);
  }

  protected setValue(newValue: number): void {
    if (isNaN(newValue)) {
      return;
    }

    if (newValue >= this._limit || newValue < 0) {
      newValue = (newValue + this._limit) % this._limit;
    }

    this._value = newValue;
  }

  protected isValidString(valueStr: string): boolean {
    const value = parseInt(valueStr);
    return !isNaN(value) && value >= 0 && value < this._limit;
  }
}
