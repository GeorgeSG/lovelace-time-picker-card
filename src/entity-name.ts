import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { EntityName } from './types';

// hass.formatEntityName only accepts a card's `name` option (a user string, a
// structured name, or undefined) from HA 2026.4. Earlier versions expose the
// same helper with an incompatible signature, so feature detection is not
// enough - the version has to be checked.
function atLeastVersion(hass: HomeAssistant, major: number, minor: number): boolean {
  const [haMajor, haMinor] = (hass.config?.version ?? '').split('.', 2);
  return Number(haMajor) > major || (Number(haMajor) === major && Number(haMinor) >= minor);
}

function supportsEntityNames(hass: HomeAssistant): boolean {
  // A hass can report a recent version without carrying the helper (a test
  // harness, or a hass that has not finished initialising), and calling it
  // then throws - so the version gate alone is not enough.
  if (!hass || typeof (hass as { formatEntityName?: unknown }).formatEntityName !== 'function') {
    return false;
  }
  return atLeastVersion(hass, 2026, 4);
}

/**
 * The `entity_name` selector, which lets users compose a name out of registry
 * parts in the visual editor, was added in HA 2025.11.
 */
export function supportsEntityNameSelector(hass: HomeAssistant): boolean {
  return atLeastVersion(hass, 2025, 11);
}

type HassWithEntityNames = HomeAssistant & {
  formatEntityName: (stateObj: HassEntity, name: EntityName | undefined) => string;
};

/**
 * Resolves a `name` option against the entity's registry context (entity,
 * device, area, floor). Falls back to the friendly name on Home Assistant
 * versions that cannot resolve a structured name.
 */
export function computeEntityName(
  hass: HomeAssistant,
  stateObj: HassEntity | undefined,
  name: EntityName | undefined,
): string | undefined {
  // A configured empty name has always meant "use Home Assistant's name", but
  // formatEntityName returns any string verbatim - including the empty one, which
  // would blank the label. Normalise it to undefined so the formatter composes.
  if (name === '') name = undefined;

  const configuredName = typeof name === 'string' ? name : undefined;

  if (!stateObj) {
    return configuredName;
  }
  if (supportsEntityNames(hass)) {
    return (hass as HassWithEntityNames).formatEntityName(stateObj, name);
  }
  return configuredName ?? stateObj.attributes.friendly_name;
}
