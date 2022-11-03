import { Hour } from '../../src/models/hour';
import { Direction } from '../../src/types';
import { DEFAULT_HOUR_STEP } from '../../src/const';

describe('Hour', () => {
  let hour: Hour;

  describe('with default config', () => {
    beforeEach(() => {
      hour = new Hour(2);
    });

    it('returns value', () => {
      expect(hour.value).toEqual(2);
    });

    it('has correct max value', () => {
      expect(hour.maxValue).toEqual(23);
    });

    describe('toString', () => {
      it('returns formatted string', () => {
        expect(hour.toString()).toEqual('02');
      });

      it('renders values correctly', () => {
        hour = new Hour(0);
        expect(hour.toString()).toEqual('00');

        hour = new Hour(6);
        expect(hour.toString()).toEqual('06');

        hour = new Hour(12);
        expect(hour.toString()).toEqual('12');

        hour = new Hour(18);
        expect(hour.toString()).toEqual('18');

        hour = new Hour(23);
        expect(hour.toString()).toEqual('23');
      });
    });

    describe('stepUpdate', () => {
      it('updates up', () => {
        hour.stepUpdate(Direction.UP);
        expect(hour.value).toEqual(3);
      });

      it('updates down', () => {
        hour.stepUpdate(Direction.DOWN);
        expect(hour.value).toEqual(1);
      });

      it('goes up from 23 to 0', () => {
        hour = new Hour(23);
        hour.stepUpdate(Direction.UP);
        expect(hour.value).toEqual(0);
      });

      it('goes down from 0 to 23', () => {
        hour = new Hour(0);
        hour.stepUpdate(Direction.DOWN);
        expect(hour.value).toEqual(23);
      });
    });

    describe('setStringValue', () => {
      it('sets value from valid string', () => {
        hour.setStringValue('3');
        expect(hour.value).toEqual(3);
      });

      it("doesn't set value from invalid string", () => {
        hour.setStringValue('test');
        expect(hour.value).toEqual(2);
      });

      it("doesn't set value from outside of scope", () => {
        hour.setStringValue('24');
        expect(hour.value).toEqual(2);
      });
    });
  });

  describe('with a different step size', () => {
    beforeEach(() => {
      hour = new Hour(2, 5);
    });

    it('goes up correctly', () => {
      hour.stepUpdate(Direction.UP);
      expect(hour.value).toEqual(7);

      hour.stepUpdate(Direction.UP);
      hour.stepUpdate(Direction.UP);
      hour.stepUpdate(Direction.UP);
      hour.stepUpdate(Direction.UP);

      expect(hour.value).toEqual(3);
    });

    it('goes down correclty', () => {
      hour.stepUpdate(Direction.DOWN);
      expect(hour.value).toEqual(21);
    });
  });

  describe('in 12 hour mode', () => {
    beforeEach(() => {
      hour = new Hour(2, DEFAULT_HOUR_STEP, 12);
    });

    it('has correct max value', () => {
      expect(hour.maxValue).toEqual(12);
    });

    describe('togglePeriod', () => {
      it('changes values correclty', () => {
        hour = new Hour(2, DEFAULT_HOUR_STEP, 12);
        hour.togglePeriod();
        expect(hour.value).toEqual(14);

        hour = new Hour(0, DEFAULT_HOUR_STEP, 12);
        hour.togglePeriod();
        expect(hour.value).toEqual(12);

        hour = new Hour(23, DEFAULT_HOUR_STEP, 12);
        hour.togglePeriod();
        expect(hour.value).toEqual(11);
      });

      it('has no side effects', () => {
        const value = hour.value;
        hour.togglePeriod();
        hour.togglePeriod();
        expect(hour.value).toEqual(value);
      });
    });

    describe('toString', () => {
      it('renders values above 12 orrectly', () => {
        hour = new Hour(13, DEFAULT_HOUR_STEP, 12);
        expect(hour.toString()).toEqual('01');
      });

      it('renders values correctly', () => {
        hour = new Hour(0, DEFAULT_HOUR_STEP, 12);
        expect(hour.toString()).toEqual('12');

        hour = new Hour(6, DEFAULT_HOUR_STEP, 12);
        expect(hour.toString()).toEqual('06');

        hour = new Hour(12, DEFAULT_HOUR_STEP, 12);
        expect(hour.toString()).toEqual('12');

        hour = new Hour(18, DEFAULT_HOUR_STEP, 12);
        expect(hour.toString()).toEqual('06');

        hour = new Hour(23, DEFAULT_HOUR_STEP, 12);
        expect(hour.toString()).toEqual('11');
      });
    });
  });
});
