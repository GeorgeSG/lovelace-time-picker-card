import { html, TemplateResult } from 'lit-element';
import { TimePickerCardConfig, Direction } from './types';
import { TimeUnit } from './models';

export class Partial {
  static unit(unit: TimeUnit, serviceFn: () => Promise<void>): TemplateResult {
    const onInputChange = ({ target: { value } }: { target: HTMLInputElement }): void => {
      unit.setStringValue(value);
      serviceFn();
    };

    return html`
      <div class="time-unit">
        ${Partial.stepChanger(Direction.UP, unit, serviceFn)}
        <input
          class="time-input"
          type="number"
          placeholder="MM"
          min="0"
          max="60"
          .value="${unit.toString()}"
          @change=${onInputChange}
        />
        ${Partial.stepChanger(Direction.DOWN, unit, serviceFn)}
      </div>
    `;
  }

  private static stepChanger(
    direction: Direction,
    unit: TimeUnit,
    serviceFn: () => Promise<void>
  ): TemplateResult {
    const onIconClick = (): void => {
      unit.stepUpdate(direction);
      serviceFn();
    };

    return html`
      <div class="time-picker-icon" @click=${onIconClick}>
        <ha-icon .icon="mdi:arrow-${direction}"></ha-icon>
        <mwc-ripple id="ripple"></mwc-ripple>
      </div>
    `;
  }

  static error(error: string, origConfig: TimePickerCardConfig): TemplateResult {
    const config = { error, origConfig };
    return html`<hui-error-card ._config="${config}"></hui-error-card>`;
  }
}
