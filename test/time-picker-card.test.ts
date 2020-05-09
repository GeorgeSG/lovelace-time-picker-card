import { expect, fixture, html } from '@open-wc/testing';
import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import '../src/time-picker-card';
import { TimePickerCard } from '../src/time-picker-card';
import { TimePickerCardConfig, HourMode } from '../src/types';
import './test-error-card';

async function render(config?: {
  entityId?: string;
  friendlyName?: string;
  hasTime?: boolean;
  hourMode?: HourMode;
  hideName?: boolean;
}): Promise<TimePickerCard> {
  const { entityId, friendlyName, hasTime, hourMode, hideName } = Object.assign(
    {
      entityId: 'input_datetime.wake_time',
      friendlyName: 'Wake Time',
      hasTime: true,
      hideName: false,
    },
    config
  );

  const testEntity: HassEntity = {
    entity_id: entityId,
    attributes: {
      friendly_name: friendlyName,
      has_time: hasTime,
    },
    state: '00:10:00',
    last_changed: '',
    last_updated: '',
    context: {
      id: entityId,
      user_id: null,
    },
  };

  const hass: Partial<HomeAssistant> = {
    states: {
      [entityId]: testEntity,
    },
  };

  const testConfig: TimePickerCardConfig = {
    type: 'custom:time-picker-card',
    entity: entityId,
    hour_mode: hourMode,
    hide: {
      name: hideName,
    },
  };

  const card = await fixture<TimePickerCard>(
    html`<time-picker-card .hass=${hass} .config=${testConfig}></time-picker-card>`
  );

  card.setConfig(testConfig);

  return card;
}

function errorCard(): string {
  return html`<hui-error-card></hui-error-card>`.getHTML();
}

describe('test', () => {
  it('renders', async () => {
    const card = await render();
    expect(card).shadowDom.to.match('time-picker-card');
  });

  it('errors if entity is not an input_datetime', async () => {
    const card = await render({ entityId: 'sensor.test_sensor' });
    expect(card).shadowDom.to.equal(errorCard());
  });

  it("errors if entity doesn't have time", async () => {
    const card = await render({ hasTime: false });
    expect(card).shadowDom.to.equal(errorCard());
  });

  it('renders card name', async () => {
    const card = await render();
    expect(card.shadowRoot?.innerHTML).to.match(/Wake Time/);
  });

  it('hides card name', async () => {
    const card = await render({ hideName: true });
    expect(card.shadowRoot?.innerHTML).not.to.match(/Wake Time/);
  });

  it('renders time units', async () => {
    const card = await render();
    expect(card.shadowRoot?.innerHTML.match(/<time-unit>/g)!.length).to.equal(2);
  });

  describe('time-period', () => {
    it('is not rendered by default', async () => {
      const card = await render();
      expect(card.shadowRoot?.innerHTML.match(/<time-period>/g)).to.be.null;
    });

    it('renders in 12-hour mode', async () => {
      const card = await render({ hourMode: 12 });
      expect(card.shadowRoot?.innerHTML.match(/<time-period>/g)!.length).to.equal(1);
    });
  });
});
