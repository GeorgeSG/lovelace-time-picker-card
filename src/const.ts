import * as pkg from '../package.json';
import { Layout } from './types';

export const CARD_VERSION = pkg.version;
export const CARD_SIZE = 3;

export const ENTITY_DOMAIN = 'input_datetime';

// Config defaults
export const DEFAULT_HOUR_STEP = 1;
export const DEFAULT_MINUTE_STEP = 5;
export const DEFAULT_SECOND_STEP = 5;
export const DEFAULT_HOUR_MODE = 24;
export const DEFAULT_LAYOUT_HOUR_MODE: Layout.HourMode = 'double';
export const DEFAULT_LAYOUT_ALIGN_CONTROLS = Layout.AlignControls.CENTER;
export const DEFAULT_LAYOUT_NAME = Layout.Name.HEADER;
