import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('Basic math', () => {
  test('1 + 1 equals 2', () => {
    expect(1 + 1).toBe(2);
  });
});
