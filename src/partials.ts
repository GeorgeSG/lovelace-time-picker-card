import { html, TemplateResult } from 'lit-element';
import { TimePickerCardConfig } from './types';
import { LovelaceCard } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';

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

  static nestedName(name: string, entity: HassEntity): TemplateResult {
    return html`<state-badge .stateObj=${entity}></state-badge>
      <div class="entity-name-inside">${name}</div>`;
  }
}
