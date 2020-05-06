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
import { Period } from '../types';

@customElement('time-period')
export class TimePeriodComponent extends LitElement {
  static readonly EVENT_TOGGLE = 'toggle';

  @property() private period!: Period;

  render(): TemplateResult {
    return html` <div class="time-period-selector">
      <div class=${classMap(this.amClass)} @click=${this.onTimePeriodChange}>
        AM<mwc-ripple></mwc-ripple>
      </div>
      <div class=${classMap(this.pmClass)} @click=${this.onTimePeriodChange}>
        PM<mwc-ripple></mwc-ripple>
      </div>
    </div>`;
  }

  onTimePeriodChange(): void {
    const event = new CustomEvent(TimePeriodComponent.EVENT_TOGGLE);
    this.dispatchEvent(event);
  }

  private get amClass(): ClassInfo {
    return { 'time-period': true, active: this.period === Period.AM };
  }

  private get pmClass(): ClassInfo {
    return { 'time-period': true, active: this.period === Period.PM };
  }

  static get styles(): CSSResult {
    return css`
      .time-period-selector {
        padding: 0 8px;
      }

      .time-period {
        width: 30px;
        padding: 8px;
        background: var(--tpc-elements-background-color);
        color: var(--tpc-text-color, #fff);
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
