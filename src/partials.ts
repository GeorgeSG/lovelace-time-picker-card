import { html, TemplateResult } from 'lit-element';
import { TimePickerCardConfig } from './types';
import { LovelaceCard } from 'custom-card-helpers';

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

  static header(title: string, icon?: string): TemplateResult | null {
    return html`
      <div class="time-picker-header">
        ${icon ? html`<ha-icon class="icon" icon=${icon}></ha-icon>` : ''}${title}
      </div>
    `;
  }
}
