import { MAX_NATIVE_DELAY, clampNativeDelay, sanitizeDelay } from '../../../src/functions/sanitize-delay';
import { describe, expect, it } from 'vitest';

describe('sanitizeDelay()', () => {
    it('should return a finite non-negative delay as it is', () => {
        expect(sanitizeDelay(0)).to.equal(0);
        expect(sanitizeDelay(0.5)).to.equal(0.5);
        expect(sanitizeDelay(1000)).to.equal(1000);
        expect(sanitizeDelay(MAX_NATIVE_DELAY + 1)).to.equal(MAX_NATIVE_DELAY + 1);
    });

    it('should return 0 for a negative delay', () => {
        expect(sanitizeDelay(-1)).to.equal(0);
        expect(sanitizeDelay(Number.NEGATIVE_INFINITY)).to.equal(0);
    });

    it('should return 0 for a delay that is not a finite number', () => {
        expect(sanitizeDelay(Number.POSITIVE_INFINITY)).to.equal(0);
        expect(sanitizeDelay(Number.NaN)).to.equal(0);
    });
});

describe('clampNativeDelay()', () => {
    it('should not modify a delay within the range supported by the native implementation', () => {
        expect(clampNativeDelay(0)).to.equal(0);
        expect(clampNativeDelay(MAX_NATIVE_DELAY)).to.equal(MAX_NATIVE_DELAY);
    });

    it('should clamp a delay beyond the range supported by the native implementation', () => {
        expect(clampNativeDelay(MAX_NATIVE_DELAY + 1)).to.equal(MAX_NATIVE_DELAY);
        expect(clampNativeDelay(Number.POSITIVE_INFINITY)).to.equal(MAX_NATIVE_DELAY);
    });
});
