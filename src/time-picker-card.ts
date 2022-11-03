import {
  ActionHandlerEvent,
  computeDomain,
  handleAction,
  hasAction,
  HomeAssistant,
  LovelaceCard,
} from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';
import { actionHandler } from './action-handler-directive';
import './components/time-period.component';
import './components/time-unit.component';
import {
  CARD_SIZE,
  CARD_VERSION,
  DEFAULT_LAYOUT_ALIGN_CONTROLS,
  DEFAULT_LAYOUT_HOUR_MODE,
  ENTITY_DOMAIN,
} from './const';
import './editor';
import { Hour } from './models/hour';
import { Minute } from './models/minute';
import { Second } from './models/second';
import { Time } from './models/time';
import { Partial } from './partials';
import { Layout, Period, TimePickerCardConfig, TimePickerHideConfig } from './types';

console.info(
  `%c  TIME-PICKER-CARD  \n%c  Version ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'time-picker-card',
  name: 'Time Picker Card',
  description: 'A Time Picker card for setting the time value of Input Datetime entities.',
});

@customElement('time-picker-card')
export class TimePickerCard extends LitElement implements LovelaceCard {
  @property({ type: Object }) hass!: HomeAssistant;
  @property() private config!: TimePickerCardConfig;
  @property() private time!: Time;
  @property() private period!: Period;

  private get entity(): HassEntity | undefined {
    return this.hass.states[this.config.entity];
  }

  private get isEmbedded(): boolean {
    return this.config.layout?.embedded === true;
  }

  private get hasNameInHeader(): boolean {
    return (
      Boolean(this.name) &&
      Boolean(this.config.hide?.name) === false &&
      this.config.layout?.name !== Layout.Name.INSIDE &&
      Boolean(this.config.layout?.embedded) === false // embedded layout disables name in header
    );
  }

  private get hasNameInside(): boolean {
    return (
      Boolean(this.name) &&
      (this.config.layout?.name === Layout.Name.INSIDE || Boolean(this.config.layout?.embedded))
    );
  }

  private get name(): string | undefined {
    return this.config.name || this.entity?.attributes.friendly_name;
  }

  private get shouldShowPeriod(): boolean {
    return this.config.hour_mode === 12;
  }

  private get layoutAlign(): Layout.AlignControls {
    return this.config.layout?.align_controls ?? DEFAULT_LAYOUT_ALIGN_CONTROLS;
  }

  private get haCardClass(): ClassInfo {
    return {
      embedded: this.isEmbedded,
      thin: this.config.layout?.thin === true,
    };
  }

  private get rowClass(): ClassInfo {
    return {
      'time-picker-row': true,
      'with-header-name': this.hasNameInHeader,
      embedded: this.isEmbedded,
    };
  }

  private get contentClass(): ClassInfo {
    return {
      'time-picker-content': true,
      [`layout-${this.layoutAlign}`]: true,
    };
  }

  private handleAction(ev: ActionHandlerEvent) {
    handleAction(this, this.hass, this.config, ev.detail.action!);
  }

  private renderHeaderName(title: string): TemplateResult {
    return html`<div
      class="time-picker-header"
      @action=${this.handleAction}
      .actionHandler="${actionHandler({
        hasHold: hasAction(this.config.hold_action),
        hasDoubleClick: hasAction(this.config.double_tap_action),
      })}"
    >
      ${title}
    </div>`;
  }

  private renderNestedName(
    name: string,
    entity: HassEntity,
    hide?: TimePickerHideConfig
  ): TemplateResult {
    const icon = html`<state-badge
      class="entity-icon"
      .stateObj=${entity}
      @action=${this.handleAction}
      .actionHandler="${actionHandler({
        hasHold: hasAction(this.config.hold_action),
        hasDoubleClick: hasAction(this.config.double_tap_action),
      })}"
    ></state-badge>`;
    const label = html`<div
      class="entity-name-inside"
      @action=${this.handleAction}
      .actionHandler="${actionHandler({
        hasHold: hasAction(this.config!.hold_action),
        hasDoubleClick: hasAction(this.config.double_tap_action),
      })}"
    >
      ${name}
    </div>`;

    const visibleElements = [
      { element: icon, visible: !hide?.icon },
      { element: label, visible: !hide?.name },
    ]
      .filter(({ visible }) => visible)
      .map(({ element }) => element);

    return html`${visibleElements}`;
  }

  render(): TemplateResult | null {
    if (!this.entity) {
      return Partial.error('Entity not found', this.config);
    }

    if (computeDomain(this.entity.entity_id) !== ENTITY_DOMAIN) {
      return Partial.error(`You must set an ${ENTITY_DOMAIN} entity`, this.config);
    }

    if (!this.entity.attributes.has_time) {
      return Partial.error(
        `You must set an ${ENTITY_DOMAIN} entity that sets has_time: true`,
        this.config
      );
    }

    const { hour, minute, second } = this.entity!.attributes;
    const hourInstance = new Hour(hour, this.config.hour_step, this.config.hour_mode);
    const minuteInstance = new Minute(minute, this.config.minute_step);
    const secondInstance = new Second(second, this.config.second_step);
    this.time = new Time(hourInstance, minuteInstance, secondInstance, this.config.link_values);
    this.period = hourInstance.value >= 12 ? Period.PM : Period.AM;

    return html`
      <ha-card class=${classMap(this.haCardClass)}>
        ${this.hasNameInHeader ? this.renderHeaderName(this.name!) : ''}
        <div class=${classMap(this.rowClass)}>
          ${this.hasNameInside
            ? this.renderNestedName(this.name!, this.entity, this.config.hide)
            : ''}

          <div class=${classMap(this.contentClass)}>
            <time-unit
              .unit=${this.time.hour}
              @stepChange=${this.onHourStepChange}
              @update=${this.callHassService}
            ></time-unit>
            <div class="time-separator">:</div>
            <time-unit
              .unit=${this.time.minute}
              @stepChange=${this.onMinuteStepChange}
              @update=${this.callHassService}
            ></time-unit>
            ${this.config.hide?.seconds === false
              ? html`<div class="time-separator">:</div>
                  <time-unit
                    .unit=${this.time.second}
                    @stepChange=${this.onSecondStepChange}
                    @update=${this.callHassService}
                  ></time-unit>`
              : ''}
            ${this.shouldShowPeriod
              ? html`<time-period
                  .period=${this.period}
                  .mode=${this.config.layout?.hour_mode ?? DEFAULT_LAYOUT_HOUR_MODE}
                  @toggle=${this.onPeriodToggle}
                ></time-period>`
              : ''}
          </div>
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
    this.time.hour.togglePeriod();
    this.callHassService();
  }

  private onHourStepChange(event: CustomEvent): void {
    this.time.hourStep(event.detail.direction);
    this.callHassService();
  }

  private onMinuteStepChange(event: CustomEvent): void {
    this.time.minuteStep(event.detail.direction);
    this.callHassService();
  }

  private onSecondStepChange(event: CustomEvent): void {
    this.time.secondStep(event.detail.direction);
    this.callHassService();
  }

  private callHassService(): Promise<void> {
    if (!this.hass) {
      throw new Error('Unable to update datetime');
    }

    return this.hass.callService(ENTITY_DOMAIN, 'set_datetime', {
      entity_id: this.entity!.entity_id,
      time: this.time.value,
    });
  }

  static get styles(): CSSResult {
    return css`
      :host {
        --tpc-elements-background-color: var(
          --time-picker-elements-background-color,
          var(--primary-color)
        );

        --tpc-control-padding: var(--time-picker-control-padding, 8px);

        --tpc-icon-color: var(--time-picker-icon-color, var(--primary-text-color));
        --tpc-text-color: var(--time-picker-text-color, #fff);
        --tpc-accent-color: var(--time-picker-accent-color, var(--primary-color));
        --tpc-off-color: var(--time-picker-off-color, var(--disabled-text-color));

        --tpc-border-radius: var(--time-picker-border-radius, var(--ha-card-border-radius, 4px));
      }

      ha-card {
        overflow: auto;
      }

      ha-card.embedded {
        box-shadow: none;
        border: none;
        background: transparent;
      }

      .time-picker-header {
        padding: 16px;
        color: var(--tpc-text-color);
        background-color: var(--tpc-elements-background-color);
        border-top-left-radius: var(--tpc-border-radius);
        border-top-right-radius: var(--tpc-border-radius);
        font-size: 1em;
        text-align: center;
      }

      .thin > .time-picker-header {
        padding: 4px;
      }

      .time-picker-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 16px;
      }

      .thin .time-picker-row {
        padding: 0 !important ;
      }

      .time-picker-row.embedded {
        padding: 0;
      }

      .time-picker-row.with-header-name {
        padding: 8px 16px 16px;
      }

      .time-picker-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1 0 auto;
      }

      .time-picker-content.layout-left {
        justify-content: flex-start;
      }

      .time-picker-content.layout-center {
        justify-content: center;
      }

      .time-picker-content.layout-right {
        justify-content: flex-end;
      }

      .entity-icon {
        cursor: pointer;
      }

      .entity-name-inside {
        margin-left: 16px;
        cursor: pointer;
      }
    `;
  }

  static getStubConfig(
    _: HomeAssistant,
    entities: Array<string>
  ): Omit<TimePickerCardConfig, 'type'> {
    const datetimeEntity = entities.find((entityId) => computeDomain(entityId) === ENTITY_DOMAIN);

    return {
      entity: datetimeEntity || 'input_datetime.example_entity',
      hour_mode: 24,
      hour_step: 1,
      minute_step: 5,
    };
  }

  static getConfigElement(): LovelaceCard {
    return document.createElement('time-picker-card-editor') as LovelaceCard;
  }
}
