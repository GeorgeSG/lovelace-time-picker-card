import { HomeAssistant, computeDomain } from 'custom-card-helpers';
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
import './components/time-period.component';
import './components/time-unit.component';
import { CARD_SIZE, CARD_VERSION } from './const';
import { Hour } from './models/hour';
import { Minute } from './models/minute';
import { Partial } from './partials';
import { Period, TimePickerCardConfig } from './types';

console.info(
  `%c  TIME-PICKER-CARD  \n%c  Version ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

@customElement('time-picker-card')
export class TimePickerCard extends LitElement {
  private static readonly ENTITY_DOMAIN = 'input_datetime';

  @property() private hass!: HomeAssistant;
  @property() private config!: TimePickerCardConfig;
  @property() private hour!: Hour;
  @property() private minute!: Minute;
  @property() private period!: Period;

  private get entity(): HassEntity | undefined {
    return this.hass.states[this.config.entity];
  }

  private get shouldShowName(): boolean {
    return Boolean(this.config.hide?.name) === false && Boolean(this.name);
  }

  private get name(): string | undefined {
    return this.config.name || this.entity?.attributes.friendly_name;
  }

  private get shouldShowPeriod(): boolean {
    return this.config.hour_mode === 12;
  }

  render(): TemplateResult | null {
    if (!this.entity) {
      return Partial.error('Entity not found', this.config);
    }

    if (computeDomain(this.entity.entity_id) !== TimePickerCard.ENTITY_DOMAIN) {
      return Partial.error(`You must set an ${TimePickerCard.ENTITY_DOMAIN} entity`, this.config);
    }

    if (!this.entity.attributes.has_time) {
      return Partial.error(
        `You must set an ${TimePickerCard.ENTITY_DOMAIN} entity that sets has_time: true`,
        this.config
      );
    }

    const { hour, minute } = this.entity!.attributes;
    this.hour = new Hour(hour, this.config.hour_step, this.config.hour_mode);
    this.minute = new Minute(minute, this.config.minute_step);
    this.period = this.hour.value >= 12 ? Period.PM : Period.AM;

    return html`
      <ha-card>
        ${this.shouldShowName ? Partial.header(this.name!) : ''}
        <div class="time-picker-content">
          <time-unit .unit=${this.hour} @update=${this.callHassService}></time-unit>
          <div class="time-separator">:</div>
          <time-unit .unit=${this.minute} @update=${this.callHassService}></time-unit>

          ${this.shouldShowPeriod
            ? html`<time-period
                .period=${this.period}
                @toggle=${this.onPeriodToggle}
              ></time-period>`
            : ''}
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

    if (config.hour_mode && config.hour_mode !== 12 && config.hour_mode !== 24) {
      throw new Error('Invalid hour_mode: select either 12 or 24');
    }

    this.config = config;
  }

  getCardSize(): number {
    return CARD_SIZE;
  }

  private onPeriodToggle(): void {
    this.hour.togglePeriod();
    this.callHassService();
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
      :host {
        --tpc-elements-background-color: var(
          --time-picker-elements-background-color,
          var(--dark-primary-color)
        );

        --tpc-icon-color: var(--time-picker-icon-color, var(--primary-text-color));
        --tpc-text-color: var(--time-picker-text-color, #fff);
        --tpc-accent-color: var(--time-picker-accent-color, var(--accent-color));
      }

      .time-picker-header {
        padding: 16px;
        color: var(--tpc-text-color);
        background-color: var(--tpc-elements-background-color);
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
