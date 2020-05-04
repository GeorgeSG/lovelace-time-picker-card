import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';
import { TimeUnit } from '../models';
import { Direction } from '../types';

@customElement('time-unit')
export class TimeUnitComponent extends LitElement {
  @property() private unit?: TimeUnit;

  render(): TemplateResult {
    if (!this.unit) {
      throw new Error('Missing unit in time-unit. This should never happen :)');
    }

    return html`<div class="time-unit">
      ${this.renderStepChanger(Direction.UP)}
      <input
        class="time-input"
        type="number"
        placeholder="MM"
        min="0"
        max="60"
        .value="${this.unit.toString()}"
        @change=${this.onInputChange}
      />
      ${this.renderStepChanger(Direction.DOWN)}
    </div>`;
  }

  onInputChange({ target: { value } }: { target: HTMLInputElement }): void {
    this.unit!.setStringValue(value);
    this.emitUpdate();
  }

  onStepChangerClick(direction: Direction): void {
    this.unit!.stepUpdate(direction);
    this.emitUpdate();
  }

  private emitUpdate(): void {
    const event = new CustomEvent('update');
    this.dispatchEvent(event);
  }

  private renderStepChanger(direction: Direction): TemplateResult {
    return html`
      <div class="time-picker-icon" @click=${() => this.onStepChangerClick(direction)}>
        <ha-icon .icon="mdi:arrow-${direction}"></ha-icon>
        <mwc-ripple id="ripple"></mwc-ripple>
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .time-unit {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 8px;
      }

      .time-picker-icon {
        width: 30px;
        padding: 8px;
        text-align: center;
        cursor: pointer;
      }

      .time-input {
        width: 30px;
        padding: 8px 8px 6px;
        background: var(--time-picker-card-background-color);
        border: 0;
        border-bottom: 2px solid var(--time-picker-card-background-color);
        color: var(--text-color, #fff);
        text-align: center;
        font-size: 1em;
        -moz-appearance: textfield;

        transition: border-color 0.2s ease-in-out;
      }

      .time-input:focus {
        outline: none;
      }

      .time-input:invalid {
        box-shadow: none;
        outline: none;
        border: 0;
        border-bottom: 2px solid red;
      }

      .time-input::-webkit-inner-spin-button,
      .time-input::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    `;
  }
}
