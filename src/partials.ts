import { html, TemplateResult } from 'lit-element';
import { TimePickerCardConfig } from './types';

export class Partial {
  static error(error: string, origConfig: TimePickerCardConfig): TemplateResult {
    const config = { error, origConfig };
    return html`<hui-error-card ._config="${config}"></hui-error-card>`;
  }
}
