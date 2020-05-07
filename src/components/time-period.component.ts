import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';
import { ClassInfo, classMap } from 'lit-html/directives/class-map';
import { Period, HourModeLayout } from '../types';

/**
 * Renders a Time Period selector with an input for a value and two arrows for step-chaning
 * the value up and down.
 */
@customElement('time-period')
export class TimePeriodComponent extends LitElement {
  static readonly EVENT_TOGGLE = 'toggle';

  @property() private period!: Period;
  @property() private mode!: HourModeLayout;

  private get amClass(): ClassInfo {
    return { 'time-period': true, active: this.period === Period.AM };
  }

  private get pmClass(): ClassInfo {
    return { 'time-period': true, active: this.period === Period.PM };
  }

  render(): TemplateResult {
    return html`<div class="time-period-selector">
      ${this.mode === 'single' ? this.renderSingle() : this.renderDouble()}
    </div>`;
  }

  onTimePeriodChange(): void {
    const event = new CustomEvent(TimePeriodComponent.EVENT_TOGGLE);
    this.dispatchEvent(event);
  }

  private renderSingle(): TemplateResult {
    return html`<div class="time-period active" @click=${this.onTimePeriodChange}>
      ${this.period}<mwc-ripple></mwc-ripple>
    </div>`;
  }

  private renderDouble(): TemplateResult {
    return html`<div class=${classMap(this.amClass)} @click=${this.onTimePeriodChange}>
        AM<mwc-ripple></mwc-ripple>
      </div>
      <div class=${classMap(this.pmClass)} @click=${this.onTimePeriodChange}>
        PM<mwc-ripple></mwc-ripple>
      </div>`;
  }

  static get styles(): CSSResult {
    return css`
      .time-period-selector {
        padding: 0 8px;
      }

      .time-period {
        width: 30px;
        padding: 8px;
        background: var(--tpc-off-color);
        color: var(--tpc-text-color);
        text-align: center;
        font-size: 1em;
        cursor: pointer;
      }

      .time-period.active {
        background: var(--tpc-accent-color);
      }
    `;
  }
}
