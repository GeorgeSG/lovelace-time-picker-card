import { describe, it, expect } from 'vitest';
import { Hour } from '../../src/models/hour';
import { Minute } from '../../src/models/minute';
import { Second } from '../../src/models/second';
import { Time } from '../../src/models/time';
import { Direction } from '../../src/types';

const time = (h: number, m: number, s: number, linkValues = false): Time =>
  new Time(new Hour(h), new Minute(m, 5), new Second(s, 5), linkValues);

describe('Time', () => {
  describe('value', () => {
    it('joins the units with colons', () => {
      expect(time(7, 5, 0).value).toEqual('7:5:0');
    });
  });

  describe('hourStep', () => {
    it('steps the hour without touching minutes', () => {
      const t = time(23, 30, 0);
      t.hourStep(Direction.UP);
      expect([t.hour.value, t.minute.value]).toEqual([0, 30]);
    });
  });

  describe('minuteStep', () => {
    it('does not change the hour when values are not linked', () => {
      const t = time(11, 55, 0);
      t.minuteStep(Direction.UP);
      expect([t.hour.value, t.minute.value]).toEqual([11, 0]);
    });

    it('carries an overflow into the next hour when values are linked', () => {
      const t = time(11, 55, 0, true);
      t.minuteStep(Direction.UP);
      expect([t.hour.value, t.minute.value]).toEqual([12, 0]);
    });

    it('borrows from the previous hour when values are linked', () => {
      const t = time(0, 0, 0, true);
      t.minuteStep(Direction.DOWN);
      expect([t.hour.value, t.minute.value]).toEqual([23, 55]);
    });

    it('carries by one hour regardless of the hour step', () => {
      const t = new Time(new Hour(10, 3), new Minute(55, 5), new Second(0), true);
      t.minuteStep(Direction.UP);
      expect(t.hour.value).toEqual(11);
    });

    it('does not carry when the step stays within the hour', () => {
      const t = time(10, 30, 0, true);
      t.minuteStep(Direction.UP);
      expect([t.hour.value, t.minute.value]).toEqual([10, 35]);
    });
  });

  describe('secondStep', () => {
    it('does not change the minute when values are not linked', () => {
      const t = time(10, 30, 55);
      t.secondStep(Direction.UP);
      expect([t.minute.value, t.second.value]).toEqual([30, 0]);
    });

    it('carries an overflow into the next minute when values are linked', () => {
      const t = time(10, 30, 55, true);
      t.secondStep(Direction.UP);
      expect([t.minute.value, t.second.value]).toEqual([31, 0]);
    });

    it('borrows from the previous minute when values are linked', () => {
      const t = time(10, 30, 0, true);
      t.secondStep(Direction.DOWN);
      expect([t.minute.value, t.second.value]).toEqual([29, 55]);
    });
  });
});
