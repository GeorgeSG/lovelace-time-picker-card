import { describe, it, expect, vi } from 'vitest';
import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { computeEntityName, supportsEntityNameSelector } from '../src/entity-name';

const entity: HassEntity = {
  entity_id: 'input_datetime.alarm',
  state: '07:30:00',
  attributes: { friendly_name: 'Alarm' },
  last_changed: '',
  last_updated: '',
  context: { id: '', user_id: null, parent_id: null },
};

const hassWithVersion = (
  version: string | undefined,
  extra: Record<string, unknown> = {},
): HomeAssistant =>
  ({ config: version ? { version } : undefined, ...extra }) as unknown as HomeAssistant;

describe('supportsEntityNameSelector', () => {
  it('is false before Home Assistant 2025.11', () => {
    expect(supportsEntityNameSelector(hassWithVersion('2025.10.3'))).toBe(false);
    expect(supportsEntityNameSelector(hassWithVersion('2024.12.0'))).toBe(false);
  });

  it('is true from Home Assistant 2025.11', () => {
    expect(supportsEntityNameSelector(hassWithVersion('2025.11.0'))).toBe(true);
    expect(supportsEntityNameSelector(hassWithVersion('2026.1.0'))).toBe(true);
  });

  it('is false when the version is unknown', () => {
    expect(supportsEntityNameSelector(hassWithVersion(undefined))).toBe(false);
  });
});

describe('computeEntityName', () => {
  it('returns the configured string when there is no entity', () => {
    expect(computeEntityName(hassWithVersion('2026.9.0'), undefined, 'Wake up')).toEqual('Wake up');
    expect(computeEntityName(hassWithVersion('2026.9.0'), undefined, undefined)).toBeUndefined();
    expect(
      computeEntityName(hassWithVersion('2026.9.0'), undefined, [{ type: 'area' }]),
    ).toBeUndefined();
  });

  it('delegates to hass.formatEntityName from Home Assistant 2026.4', () => {
    const formatEntityName = vi.fn().mockReturnValue('Bedroom Alarm');
    const hass = hassWithVersion('2026.4.0', { formatEntityName });
    const name = [{ type: 'area' as const }, { type: 'entity' as const }];

    expect(computeEntityName(hass, entity, name)).toEqual('Bedroom Alarm');
    expect(formatEntityName).toHaveBeenCalledWith(entity, name);
  });

  it('passes an undefined name through to hass.formatEntityName', () => {
    const formatEntityName = vi.fn().mockReturnValue('Alarm');
    computeEntityName(hassWithVersion('2026.4.0', { formatEntityName }), entity, undefined);
    expect(formatEntityName).toHaveBeenCalledWith(entity, undefined);
  });

  it('falls back to the friendly name before Home Assistant 2026.4', () => {
    const formatEntityName = vi.fn();
    const hass = hassWithVersion('2026.3.2', { formatEntityName });

    expect(computeEntityName(hass, entity, [{ type: 'area' }])).toEqual('Alarm');
    expect(computeEntityName(hass, entity, undefined)).toEqual('Alarm');
    expect(formatEntityName).not.toHaveBeenCalled();
  });

  it('prefers a configured string over the friendly name on older versions', () => {
    expect(computeEntityName(hassWithVersion('2026.3.2'), entity, 'Wake up')).toEqual('Wake up');
  });

  it('falls back when a recent hass does not carry formatEntityName', () => {
    expect(computeEntityName(hassWithVersion('2026.9.0'), entity, 'Wake up')).toEqual('Wake up');
    expect(computeEntityName(hassWithVersion('2026.9.0'), entity, undefined)).toEqual('Alarm');
  });
});
