import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { TimePickerCardConfig } from './types';

const NAME_TO_LABEL_MAP = {
  entity: 'input_datetime entity id',
  name: 'Name',
  hour_step: 'Hour step',
  minute_step: 'Minute step',
  hour_mode: 'Hour mode',
  link_values: 'Link values',
  align_controls: 'Align controls',
  embedded: 'Embedded?',
  thin: 'Thin layout?',
  icon: 'Icon',
  seconds: 'Seconds',
};

const SCHEMA = [
  { name: 'entity', selector: { entity: { domain: 'input_datetime' } } },
  {
    name: 'name',
    selector: { text: {} },
  },
  {
    type: 'grid',
    schema: [
      {
        name: 'hour_step',
        type: 'integer',
        required: true,
        default: 1,
        valueMin: 1,
        valueMax: 24,
      },
      {
        name: 'minute_step',
        type: 'integer',
        required: true,
        default: 5,
        valueMin: 1,
        valueMax: 60,
      },
      {
        name: 'hour_mode',
        type: 'select',
        options: [
          [12, '12'],
          [24, '24'],
        ],
      },
      { name: 'link_values', type: 'boolean' },
    ],
  },
  {
    type: 'expandable',
    name: 'layout',
    title: 'Layout controls',
    schema: [
      {
        name: 'hour_mode',
        type: 'select',
        options: [
          ['single', 'single'],
          ['double', 'double'],
        ],
      },
      {
        name: 'align_controls',
        type: 'select',
        options: [
          ['left', 'left'],
          ['center', 'center'],
          ['right', 'right'],
        ],
      },
      {
        name: 'name',
        type: 'select',
        options: [
          ['header', 'header'],
          ['inside', 'inside'],
        ],
      },
      { name: 'embedded', type: 'boolean' },
      { name: 'thin', type: 'boolean' },
    ],
  },
  {
    type: 'expandable',
    name: 'hide',
    title: 'Hide controls',
    schema: [
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'name', type: 'boolean' },
          { name: 'icon', type: 'boolean' },
          { name: 'seconds', type: 'boolean' },
        ],
      },
    ],
  },
  {
    type: 'expandable',
    title: 'Actions',
    schema: [
      { name: 'tap_action', selector: { action: {} } },
      { name: 'double_tap_action', selector: { action: {} } },
      { name: 'hold_action', selector: { action: {} } },
    ],
  },
];

@customElement('time-picker-card-editor')
export class TimePickerCardEditor extends LitElement implements LovelaceCardEditor {
  private static readonly CONFIG_CHANGED_EVENT = 'config-changed';

  @property({ type: Object }) hass!: HomeAssistant;
  @property() private config!: TimePickerCardConfig;

  private computeLabel({ name }) {
    return NAME_TO_LABEL_MAP[name] || name;
  }

  private valueChanged(ev: CustomEvent): void {
    const newConfig = { ...this.config, ...ev.detail.value };
    this.dispatch(newConfig);
  }

  render(): TemplateResult {
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${SCHEMA}
        .computeLabel=${this.computeLabel}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }

  setConfig(config): void {
    this.config = config;
  }

  private dispatch(config: TimePickerCardConfig): void {
    const event = new CustomEvent(TimePickerCardEditor.CONFIG_CHANGED_EVENT, {
      bubbles: true,
      composed: true,
      detail: { config },
    });

    this.dispatchEvent(event);
  }
}
