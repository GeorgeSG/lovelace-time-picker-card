import { Minute } from '../../src/models/minute';
import { Direction } from '../../src/types';

describe('Minute', () => {
  let minute: Minute;

  describe('with default config', () => {
    beforeEach(() => {
      minute = new Minute(2);
    });

    it('returns value', () => {
      expect(minute.value).toEqual(2);
    });

    it('has correct max value', () => {
      expect(minute.maxValue).toEqual(59);
    });

    describe('toString', () => {
      it('renders values correctly', () => {
        minute = new Minute(0);
        expect(minute.toString()).toEqual('00');

        minute = new Minute(5);
        expect(minute.toString()).toEqual('05');

        minute = new Minute(59);
        expect(minute.toString()).toEqual('59');
      });
    });

    describe('stepUpdate', () => {
      it('updates up', () => {
        minute.stepUpdate(Direction.UP);
        expect(minute.value).toEqual(7);
      });

      it('updates down', () => {
        minute.stepUpdate(Direction.DOWN);
        expect(minute.value).toEqual(57);
      });

      it('goes up from 59 to 4', () => {
        minute = new Minute(59);
        minute.stepUpdate(Direction.UP);
        expect(minute.value).toEqual(4);
      });

      it('goes down from 0 to 55', () => {
        minute = new Minute(0);
        minute.stepUpdate(Direction.DOWN);
        expect(minute.value).toEqual(55);
      });
    });

    describe('setStringValue', () => {
      it('sets value from valid string', () => {
        minute.setStringValue('3');
        expect(minute.value).toEqual(3);
      });

      it("doesn't set value from invalid string", () => {
        minute.setStringValue('test');
        expect(minute.value).toEqual(2);
      });

      it("doesn't set value from outside of scope", () => {
        minute.setStringValue('60');
        expect(minute.value).toEqual(2);

        minute.setStringValue('65');
        expect(minute.value).toEqual(2);
      });
    });
  });

  describe('with a different step size', () => {
    beforeEach(() => {
      minute = new Minute(2, 15);
    });

    it('goes up correctly', () => {
      minute.stepUpdate(Direction.UP);
      expect(minute.value).toEqual(17);

      minute.stepUpdate(Direction.UP);
      minute.stepUpdate(Direction.UP);
      minute.stepUpdate(Direction.UP);
      expect(minute.value).toEqual(2);

      minute.stepUpdate(Direction.UP);
      expect(minute.value).toEqual(17);
    });

    it('goes down correclty', () => {
      minute.stepUpdate(Direction.DOWN);
      expect(minute.value).toEqual(47);
    });
  });

  describe('will overflow', () => {
    it('returns true if the minutes will overflow an hour up', () => {
      minute.setStringValue('59');
      expect(minute.willOverflow(Direction.UP)).toBe(true);
    });

    it('returns true if the minutes will overflow an hour down', () => {
      minute.setStringValue('0');
      expect(minute.willOverflow(Direction.DOWN)).toBe(true);
    });

    it('returns true if the minutes will not overflow', () => {
      minute.setStringValue('55');
      expect(minute.willOverflow(Direction.DOWN)).toBe(false);
    });
  });
});
