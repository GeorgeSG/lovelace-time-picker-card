import { LovelaceCard } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { html, TemplateResult } from 'lit';
import { TimePickerCardConfig, TimePickerHideConfig } from './types';

export class Partial {
  static error(error: string, origConfig: TimePickerCardConfig): TemplateResult {
    const errorCard = document.createElement('hui-error-card') as LovelaceCard;
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig,
    });

    return html`${errorCard}`;
  }

  static headerName(title: string): TemplateResult {
    return html`<div class="time-picker-header">${title}</div>`;
  }

  static nestedName(name: string, entity: HassEntity, hide?: TimePickerHideConfig): TemplateResult {
    const icon = html`<state-badge .stateObj=${entity}></state-badge>`;
    const label = html`<div class="entity-name-inside">${name}</div>`;

    const visibleElements = [
      { show: !hide?.icon, value: icon },
      { show: !hide?.name, value: label },
    ]
      .filter(({ show }) => show)
      .map(({ value }) => value);

    return html`${visibleElements}`;

    // return hideIcon ? label : html`${icon}${label}`;
  }
}
