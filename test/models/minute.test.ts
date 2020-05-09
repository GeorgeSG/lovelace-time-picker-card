import { Minute } from '../../src/models/minute';
import { Direction } from '../../src/types';
import { expect } from 'chai';

describe('Minute', () => {
  let minute: Minute;

  context('with default config', () => {
    beforeEach(() => {
      minute = new Minute(2);
    });

    it('returns value', () => {
      expect(minute.value).to.equal(2);
    });

    it('has correct max value', () => {
      expect(minute.maxValue).to.equal(59);
    });

    describe('toString', () => {
      it('renders values correctly', () => {
        minute = new Minute(0);
        expect(minute.toString()).to.equal('00');

        minute = new Minute(5);
        expect(minute.toString()).to.equal('05');

        minute = new Minute(59);
        expect(minute.toString()).to.equal('59');
      });
    });

    describe('stepUpdate', () => {
      it('updates up', () => {
        minute.stepUpdate(Direction.UP);
        expect(minute.value).to.equal(7);
      });

      it('updates down', () => {
        minute.stepUpdate(Direction.DOWN);
        expect(minute.value).to.equal(57);
      });

      it('goes up from 59 to 4', () => {
        minute = new Minute(59);
        minute.stepUpdate(Direction.UP);
        expect(minute.value).to.equal(4);
      });

      it('goes down from 0 to 55', () => {
        minute = new Minute(0);
        minute.stepUpdate(Direction.DOWN);
        expect(minute.value).to.equal(55);
      });
    });

    describe('setStringValue', () => {
      it('sets value from valid string', () => {
        minute.setStringValue('3');
        expect(minute.value).to.equal(3);
      });

      it("doesn't set value from invalid string", () => {
        minute.setStringValue('test');
        expect(minute.value).to.equal(2);
      });

      it("doesn't set value from outside of scope", () => {
        minute.setStringValue('60');
        expect(minute.value).to.equal(2);

        minute.setStringValue('65');
        expect(minute.value).to.equal(2);
      });
    });
  });

  context('with a different step size', () => {
    beforeEach(() => {
      minute = new Minute(2, 15);
    });

    it('goes up correctly', () => {
      minute.stepUpdate(Direction.UP);
      expect(minute.value).to.equal(17);

      minute.stepUpdate(Direction.UP);
      minute.stepUpdate(Direction.UP);
      minute.stepUpdate(Direction.UP);
      expect(minute.value).to.equal(2);

      minute.stepUpdate(Direction.UP);
      expect(minute.value).to.equal(17);
    });

    it('goes down correclty', () => {
      minute.stepUpdate(Direction.DOWN);
      expect(minute.value).to.equal(47);
    });
  });
});
