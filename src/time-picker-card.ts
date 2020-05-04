import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { CARD_VERSION } from './const';
import { Hour, Minute, TimeUnit } from './models';
import { Partial } from './partials';
import { styles, styleVariables } from './styles';
import { Direction, TimePickerCardConfig } from './types';

console.info(
  `%c  TIME-PICKER-CARD  \n%c  Version ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

@customElement('time-picker-card')
export class TimePickerCard extends LitElement {
  @property() private hass?: HomeAssistant;
  @property() private config?: TimePickerCardConfig;
  @property() private hour?: Hour;
  @property() private minute?: Minute;

  private get entity(): HassEntity | undefined {
    if (!this.config) {
      return;
    }

    return this.hass?.states[this.config!.entity];
  }

  render(): TemplateResult | null {
    if (!this.config || !this.hass) {
      return null;
    }

    if (!this.entity?.entity_id.startsWith('input_datetime')) {
      return Partial.error('You must set an input_datetime entity', this.config);
    }

    if (!this.entity.attributes.has_time) {
      return Partial.error(
        'You must set an input_datetime entity that sets has_time: true',
        this.config
      );
    }

    this.setStyleVarialbes();
    this.hour = new Hour(this.entity?.attributes.hour ?? 0, this.config.hour_step);
    this.minute = new Minute(this.entity?.attributes.minute ?? 0, this.config.minute_step);

    return html`
      <ha-card class="time-picker-ha-card">
        <div class="time-form">
          ${this.renderStepChanger(Direction.UP, this.hour)}
          <input
            class="time-input"
            type="number"
            placeholder="HH"
            min="0"
            max="24"
            .value=${this.hour.toString()}
            @change=${this.onHourChange}
          />
          ${this.renderStepChanger(Direction.DOWN, this.hour)}
        </div>
        <div class="time-separator">
          :
        </div>
        <div class="time-form">
          ${this.renderStepChanger(Direction.UP, this.minute)}
          <input
            class="time-input"
            type="number"
            placeholder="MM"
            min="0"
            max="60"
            .value="${this.minute.toString()}"
            @change=${this.onMinuteChange}
          />
          ${this.renderStepChanger(Direction.DOWN, this.minute)}
        </div>
      </ha-card>
    `;
  }

  setConfig(config): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    if (!config.entity) {
      throw new Error('You must set an entity');
    }

    this.config = config;
  }

  getCardSize(): number {
    return 3;
  }

  onHourChange({ target: { value } }: { target: HTMLInputElement }): void {
    this.hour!.setStringValue(value);
    this.callService();
  }

  onMinuteChange({ target: { value } }: { target: HTMLInputElement }): void {
    this.minute!.setStringValue(value);
    this.callService();
  }

  private renderStepChanger(direction: Direction, unit: TimeUnit): TemplateResult {
    const onIconClick = (): void => {
      unit.stepUpdate(direction);
      this.callService();
    };

    return html`
      <div class="time-picker-icon" @click=${onIconClick}>
        <ha-icon .icon="mdi:arrow-${direction}"></ha-icon>
        <mwc-ripple id="ripple"></mwc-ripple>
      </div>
    `;
  }

  private callService(): Promise<void> {
    if (!this.hass) {
      throw new Error('Unable to update datetime');
    }

    const time = `${this.hour!.value}:${this.minute!.value}:00`;

    return this.hass.callService('input_datetime', 'set_datetime', {
      entity_id: this.entity?.entity_id,
      time,
    });
  }

  private setStyleVarialbes(): void {
    Object.entries(styleVariables).forEach(([variable, value]) =>
      this.style.setProperty(variable, value)
    );
  }

  static get styles(): CSSResult {
    return styles;
  }
}
