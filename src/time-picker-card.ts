import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';
import './components/time-unit.component';
import { CARD_SIZE, CARD_VERSION, STYLE_VARIABLES } from './const';
import { Hour } from './models/hour';
import { Minute } from './models/minute';
import { Partial } from './partials';
import { TimePickerCardConfig } from './types';

console.info(
  `%c  TIME-PICKER-CARD  \n%c  Version ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

@customElement('time-picker-card')
export class TimePickerCard extends LitElement {
  @property() private hass!: HomeAssistant;
  @property() private config!: TimePickerCardConfig;
  @property() private hour!: Hour;
  @property() private minute!: Minute;

  connectedCallback(): void {
    super.connectedCallback();

    Object.entries(STYLE_VARIABLES).forEach(([variable, value]) =>
      this.style.setProperty(variable, value)
    );
  }

  private get entity(): HassEntity | undefined {
    return this.hass.states[this.config.entity];
  }

  private get shouldShowName(): boolean {
    return Boolean(this.config.hide?.name) === false && Boolean(this.name);
  }

  private get name(): string | undefined {
    return this.config.name || this.entity?.attributes.friendly_name;
  }

  render(): TemplateResult | null {
    if (!this.entity) {
      return Partial.error('Entity not found', this.config);
    }

    if (!this.entity.entity_id.startsWith('input_datetime')) {
      return Partial.error('You must set an input_datetime entity', this.config);
    }

    if (!this.entity.attributes.has_time) {
      return Partial.error(
        'You must set an input_datetime entity that sets has_time: true',
        this.config
      );
    }

    const { hour, minute } = this.entity!.attributes;
    this.hour = new Hour(hour, this.config.hour_step);
    this.minute = new Minute(minute, this.config.minute_step);

    return html`
      <ha-card class="time-picker-ha-card">
        ${this.shouldShowName ? Partial.header(this.name!) : ''}
        <div class="time-picker-content">
          <time-unit .unit=${this.hour} @update=${this.callHassService}></time-unit>
          <div class="time-separator">:</div>
          <time-unit .unit=${this.minute} @update=${this.callHassService}></time-unit>
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
    return CARD_SIZE;
  }

  private callHassService(): Promise<void> {
    if (!this.hass) {
      throw new Error('Unable to update datetime');
    }

    const time = `${this.hour.value}:${this.minute.value}:00`;

    return this.hass.callService('input_datetime', 'set_datetime', {
      entity_id: this.entity!.entity_id,
      time,
    });
  }

  static get styles(): CSSResult {
    return css`
      .time-picker-ha-card {
      }

      .time-picker-header {
        padding: 16px;
        background-color: var(--time-picker-card-background-color);
        font-size: 1em;
        text-align: center;
      }

      .time-picker-content {
        padding: 8px 16px 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    `;
  }
}
