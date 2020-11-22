import { computeDomain, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
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
import {
  DEFAULT_HOUR_STEP,
  DEFAULT_MINUTE_STEP,
  ENTITY_DOMAIN,
  DEFAULT_LAYOUT_ALIGN_CONTROLS,
  DEFAULT_LAYOUT_NAME,
  DEFAULT_SECOND_STEP,
} from './const';
import { TimePickerCardConfig, Layout, HourMode } from './types';

@customElement('time-picker-card-editor')
export class TimePickerCardEditor extends LitElement implements LovelaceCardEditor {
  private static readonly NUMBER_PROPERTIES = [
    'hour_step',
    'minute_step',
    'second_step',
    'hour_mode',
  ];
  private static readonly CONFIG_CHANGED_EVENT = 'config-changed';

  @property({ type: Object }) hass!: HomeAssistant;
  @property() private config!: TimePickerCardConfig;

  private get entity(): HassEntity | undefined {
    return this.hass.states[this.config.entity];
  }

  private get datetimeEntities(): Array<string> {
    return Object.keys(this.hass.states).filter(
      (entityId) =>
        computeDomain(entityId) === ENTITY_DOMAIN &&
        this.hass.states[entityId].attributes.has_time === true
    );
  }

  render(): TemplateResult {
    return html`<div class="card-config">
      <paper-dropdown-menu
        style="width: 100%"
        label="Entity (Required)"
        .configValue=${'entity'}
        @value-changed=${this.onValueChange}
      >
        <paper-listbox
          slot="dropdown-content"
          .selected=${this.datetimeEntities.indexOf(this.config.entity)}
        >
          ${this.datetimeEntities.map((entity) => html`<paper-item>${entity}</paper-item>`)}
        </paper-listbox>
      </paper-dropdown-menu>
      <paper-input
        label="Name (Optional)"
        .configValue=${'name'}
        .value=${this.config.name}
        .placeholder=${this.entity?.attributes.friendly_name}
        @value-changed=${this.onValueChange}
      ></paper-input>
      <div class="side-by-side">
        <div>
          <ha-switch
            style="margin-left: 10px"
            .checked="${!Boolean(this.config.hide?.name)}"
            @change="${this.onHideNameChange}"
          ></ha-switch>
          Show name?
        </div>
        <paper-dropdown-menu
          style="width: 100%"
          label="Name Position (Optional)"
          @value-changed=${this.onLayoutNameChange}
        >
          <paper-listbox
            slot="dropdown-content"
            .selected=${Object.values(Layout.Name).indexOf(
              this.config.layout?.name ?? DEFAULT_LAYOUT_NAME
            )}
          >
            ${Object.values(Layout.Name).map((name) => html`<paper-item>${name}</paper-item>`)}
          </paper-listbox>
        </paper-dropdown-menu>
      </div>
      <div class="side-by-side">
        <paper-input
          type="number"
          label="Hour Step (Optional)"
          .configValue=${'hour_step'}
          .value=${this.config.hour_step || DEFAULT_HOUR_STEP}
          @value-changed=${this.onValueChange}
        ></paper-input>
        <paper-input
          type="number"
          label="Minute Step (Optional)"
          .configValue=${'minute_step'}
          .value=${this.config.minute_step || DEFAULT_MINUTE_STEP}
          @value-changed=${this.onValueChange}
        ></paper-input>
      </div>
      <div class="side-by-side">
        <div>
          <ha-switch
            style="margin-left: 10px"
            .checked="${this.config.hide?.seconds === false}"
            @change="${this.onHideSecondsChange}"
          ></ha-switch>
          Show seconds?
        </div>
        <paper-input
          type="number"
          label="Second Step (Optional)"
          .configValue=${'second_step'}
          .value=${this.config.second_step || DEFAULT_SECOND_STEP}
          @value-changed=${this.onValueChange}
        ></paper-input>
      </div>
      <div class="side-by-side">
        <div>
          <ha-switch
            .checked="${this.config.hour_mode === 12}"
            @change="${this.onHourModeChange}"
          ></ha-switch>
          12-Hour mode
        </div>
        ${this.config.hour_mode === 12
          ? html`<div>
              <ha-switch
                .checked="${this.config.layout?.hour_mode === 'single'}"
                @change="${this.onHourModeLayoutChange}"
              ></ha-switch>
              "Single" hour mode layout
            </div>`
          : ''}
      </div>
      <div class="side-by-side">
        <paper-dropdown-menu
          style="width: 100%"
          label="Align Controls (Optional)"
          @value-changed=${this.onLayoutAlignChange}
        >
          <paper-listbox
            slot="dropdown-content"
            .selected=${Object.values(Layout.AlignControls).indexOf(
              this.config.layout?.align_controls ?? DEFAULT_LAYOUT_ALIGN_CONTROLS
            )}
          >
            ${Object.values(Layout.AlignControls).map((a) => html`<paper-item>${a}</paper-item>`)}
          </paper-listbox>
        </paper-dropdown-menu>
        <div>
          <ha-switch
            .checked="${this.config.link_values}"
            @change="${this.onLinkValuesChange}"
          ></ha-switch>
          Link Values
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <ha-switch
            .checked="${this.config.layout?.embedded}"
            @change="${this.onEmbeddedChange}"
          ></ha-switch>
          Embedded
        </div>
      </div>
    </div>`;
  }

  setConfig(config): void {
    this.config = config;
  }

  private onHourModeChange({ target: { checked } }): void {
    const hourMode: HourMode = checked ? 12 : 24;

    const newConfig = { ...this.config, hour_mode: hourMode };
    this.dispatch(newConfig);
  }

  private onHideNameChange({ target: { checked } }): void {
    const hide = { ...this.config.hide, name: !checked };
    const newConfig = { ...this.config, hide };
    this.dispatch(newConfig);
  }

  private onHideSecondsChange({ target: { checked } }): void {
    const hide = { ...this.config.hide, seconds: !checked };
    const newConfig = { ...this.config, hide };
    this.dispatch(newConfig);
  }

  private onLayoutAlignChange({ detail: { value } }: CustomEvent): void {
    const layout = { ...this.config.layout, align_controls: value };
    const newConfig = { ...this.config, layout };
    this.dispatch(newConfig);
  }

  private onLayoutNameChange({ detail: { value } }: CustomEvent): void {
    const layout = { ...this.config.layout, name: value };
    const newConfig = { ...this.config, layout };
    this.dispatch(newConfig);
  }

  private onHourModeLayoutChange({ target: { checked } }): void {
    const hourModeLayout: Layout.HourMode = checked ? 'single' : 'double';

    const newConfig = {
      ...this.config,
      layout: { ...this.config.layout, hour_mode: hourModeLayout },
    };
    this.dispatch(newConfig);
  }

  private onLinkValuesChange({ target: { checked } }): void {
    const newConfig = { ...this.config, link_values: checked };
    this.dispatch(newConfig);
  }

  private onEmbeddedChange({ target: { checked } }): void {
    const newConfig = { ...this.config, layout: { embedded: checked } };
    this.dispatch(newConfig);
  }

  private onValueChange(e: CustomEvent): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const property = (e.target as any).configValue;
    let value = e.detail.value;

    if (TimePickerCardEditor.NUMBER_PROPERTIES.indexOf(property) > -1) {
      value = parseInt(value);

      if (isNaN(value)) {
        return;
      }
    }

    if (this.config[property] === value) {
      return;
    }

    const newConfig = { ...this.config, [property]: value };

    this.dispatch(newConfig);
  }

  private dispatch(config: TimePickerCardConfig): void {
    const event = new CustomEvent(TimePickerCardEditor.CONFIG_CHANGED_EVENT, {
      bubbles: true,
      composed: true,
      detail: { config },
    });

    this.dispatchEvent(event);
  }

  static get styles(): CSSResult {
    return css`
      ha-switch {
        padding: 16px 0;
        margin-right: 16px;
      }
      .side-by-side {
        display: flex;
      }
      .side-by-side > * {
        flex: 1;
        padding-right: 4px;
      }
      .suffix {
        margin: 0 8px;
      }
    `;
  }
}
