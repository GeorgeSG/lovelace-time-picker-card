import { LovelaceCard } from 'custom-card-helpers';
import { html, TemplateResult } from 'lit';
import { TimePickerCardConfig } from './types';

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
}
