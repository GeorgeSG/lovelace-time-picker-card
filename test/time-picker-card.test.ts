import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LitElement } from 'lit';
import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import '../src/time-picker-card';
import { TimePickerCard } from '../src/time-picker-card';
import { TimePickerCardConfig } from '../src/types';

// The card renders Home Assistant's error card for invalid configs; stub the
// element so the test can read the error it was given.
class ErrorCardStub extends HTMLElement {
  config?: { error: string };
  setConfig(config: { error: string }): void {
    this.config = config;
  }
}
customElements.define('hui-error-card', ErrorCardStub);

const ENTITY_ID = 'input_datetime.alarm';

/** YAML is untyped at runtime, so setConfig has to cope with shapes the type forbids. */
const invalidConfig = (config: Record<string, unknown>): TimePickerCardConfig =>
  config as unknown as TimePickerCardConfig;

const alarm = (hour: number, minute = 30, second = 0): HassEntity => ({
  entity_id: ENTITY_ID,
  state: `${hour}:${minute}:${second}`,
  attributes: { friendly_name: 'Alarm', has_time: true, has_date: false, hour, minute, second },
  last_changed: '',
  last_updated: '',
  context: { id: '', user_id: null, parent_id: null },
});

const createHass = (entity: HassEntity = alarm(7)): HomeAssistant =>
  ({
    states: { [entity.entity_id]: entity },
    config: { version: '2026.9.2' },
    callService: vi.fn().mockResolvedValue(undefined),
  }) as unknown as HomeAssistant;

const renderCard = async (
  config: Partial<TimePickerCardConfig>,
  hass: HomeAssistant = createHass(),
): Promise<TimePickerCard> => {
  const card = document.createElement('time-picker-card') as TimePickerCard;
  card.setConfig({ type: 'custom:time-picker-card', entity: ENTITY_ID, ...config });
  card.hass = hass;
  document.body.appendChild(card);
  await settle(card);
  return card;
};

/** Waits for the card and its nested Lit children to finish rendering. */
const settle = async (card: TimePickerCard): Promise<void> => {
  await card.updateComplete;
  const children = card.shadowRoot!.querySelectorAll('time-unit, time-period');
  await Promise.all(Array.from(children).map((el) => (el as LitElement).updateComplete));
};

const inputValues = (card: TimePickerCard): string[] =>
  Array.from(card.shadowRoot!.querySelectorAll('time-unit')).map(
    (unit) => unit.shadowRoot!.querySelector<HTMLInputElement>('input')!.value,
  );

describe('time-picker-card', () => {
  let card: TimePickerCard;

  afterEach(() => {
    card?.remove();
  });

  describe('setConfig', () => {
    beforeEach(() => {
      card = document.createElement('time-picker-card') as TimePickerCard;
    });

    it('rejects a missing entity', () => {
      expect(() => card.setConfig(invalidConfig({ type: 'custom:time-picker-card' }))).toThrow(
        'You must set an entity',
      );
    });

    it('rejects an unknown hour mode', () => {
      expect(() =>
        card.setConfig(
          invalidConfig({ type: 'custom:time-picker-card', entity: ENTITY_ID, hour_mode: 10 }),
        ),
      ).toThrow('Invalid hour_mode');
    });
  });

  describe('rendering', () => {
    it('shows hour and minute inputs with the entity time', async () => {
      card = await renderCard({});
      expect(inputValues(card)).toEqual(['07', '30']);
      expect(card.shadowRoot!.querySelector('time-period')).toBeNull();
    });

    it('shows the entity name in the header by default', async () => {
      card = await renderCard({});
      expect(card.shadowRoot!.querySelector('.time-picker-header')!.textContent!.trim()).toEqual(
        'Alarm',
      );
    });

    it('shows seconds and an AM/PM toggle when configured', async () => {
      card = await renderCard({ hour_mode: 12, hide: { seconds: false } });
      expect(inputValues(card)).toEqual(['07', '30', '00']);
      expect(card.shadowRoot!.querySelector('time-period')).not.toBeNull();
    });

    it('re-renders when hass delivers a new entity state', async () => {
      card = await renderCard({});
      card.hass = createHass(alarm(9, 45));
      await settle(card);
      expect(inputValues(card)).toEqual(['09', '45']);
    });

    it('renders an error card when the entity is missing', async () => {
      card = await renderCard({ entity: 'input_datetime.missing' });
      const error = card.shadowRoot!.querySelector('hui-error-card') as ErrorCardStub;
      expect(error.config?.error).toEqual('Entity not found');
    });

    it('renders an error card when the entity has no time', async () => {
      const dateOnly = { ...alarm(7), attributes: { friendly_name: 'Date', has_time: false } };
      card = await renderCard({}, createHass(dateOnly));
      const error = card.shadowRoot!.querySelector('hui-error-card') as ErrorCardStub;
      expect(error.config?.error).toContain('has_time: true');
    });
  });

  describe('interaction', () => {
    it('calls set_datetime when an hour arrow is clicked', async () => {
      const hass = createHass();
      card = await renderCard({}, hass);
      const hourUnit = card.shadowRoot!.querySelector('time-unit')!;
      hourUnit.shadowRoot!.querySelector<HTMLElement>('.time-picker-icon')!.click();

      expect(hass.callService).toHaveBeenCalledWith('input_datetime', 'set_datetime', {
        entity_id: ENTITY_ID,
        time: '8:30:0',
      });
    });

    it('debounces the service call when a delay is configured', async () => {
      vi.useFakeTimers();
      try {
        const hass = createHass();
        card = await renderCard({ delay: 500 }, hass);
        const [up] = Array.from(
          card
            .shadowRoot!.querySelector('time-unit')!
            .shadowRoot!.querySelectorAll<HTMLElement>('.time-picker-icon'),
        );
        up.click();
        up.click();
        expect(hass.callService).not.toHaveBeenCalled();

        vi.advanceTimersByTime(500);
        expect(hass.callService).toHaveBeenCalledTimes(1);
        expect(hass.callService).toHaveBeenCalledWith('input_datetime', 'set_datetime', {
          entity_id: ENTITY_ID,
          time: '9:30:0',
        });
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
