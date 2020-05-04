import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { CARD_VERSION } from './const';
import { Hour, Minute } from './models';
import { Partial } from './partials';
import { styles, styleVariables } from './styles';
import { TimePickerCardConfig } from './types';

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
        ${Partial.unit(this.hour, this.serviceFn.bind(this))}
        <div class="time-separator">:</div>
        ${Partial.unit(this.minute, this.serviceFn.bind(this))}
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

  private serviceFn(): Promise<void> {
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
