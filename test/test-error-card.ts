import { LovelaceCard } from 'custom-card-helpers';
import { customElement, html, LitElement, TemplateResult } from 'lit-element';

@customElement('hui-error-card')
export class HuiErrorCard extends LitElement implements LovelaceCard {
  setConfig(): void {
    return;
  }

  render(): TemplateResult {
    return html``;
  }

  getCardSize(): number {
    return 1;
  }
}
