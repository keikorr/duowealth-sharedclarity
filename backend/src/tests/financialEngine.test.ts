import { describe, it, expect } from 'vitest';
import {
  calculateExpenseSplit,
  calculateSavingsRate,
  calculateProjections,
  calculateEmergencyFundRatio
} from '../services/financialEngine';

describe('Financial Engine Services', () => {
  describe('calculateExpenseSplit', () => {
    it('splits expenses 50/50 correctly', () => {
      const split = calculateExpenseSplit(1000, 50, 50);
      expect(split.amountA).toBe(500);
      expect(split.amountB).toBe(500);
    });

    it('splits expenses 70/30 correctly', () => {
      const split = calculateExpenseSplit(1000, 70, 30);
      expect(split.amountA).toBe(700);
      expect(split.amountB).toBe(300);
    });

    it('handles floating point precision properly', () => {
      const split = calculateExpenseSplit(333.33, 50, 50);
      expect(split.amountA + split.amountB).toBe(333.33);
    });
  });

  describe('calculateSavingsRate', () => {
    it('calculates accurate savings rate percentage', () => {
      const rate = calculateSavingsRate(10000, 6500);
      expect(rate).toBe(35);
    });

    it('returns 0 if expenses equal or exceed income', () => {
      expect(calculateSavingsRate(5000, 6000)).toBe(0);
    });
  });

  describe('calculateProjections', () => {
    it('generates trajectory points for 0 to 20 years', () => {
      const projections = calculateProjections(50000, 2000, 10, 6);
      expect(projections.length).toBe(7);
      expect(projections[0].expectedValue).toBe(50000);
      expect(projections[projections.length - 1].expectedValue).toBeGreaterThan(projections[0].expectedValue);
      expect(projections[projections.length - 1].expectedValue).toBeGreaterThan(projections[projections.length - 1].conservativeValue);
    });
  });

  describe('calculateEmergencyFundRatio', () => {
    it('calculates coverage status accurately', () => {
      const result = calculateEmergencyFundRatio(30000, 5000);
      expect(result.monthsCovered).toBe(6);
      expect(result.targetSixMonths).toBe(30000);
      expect(result.status).toBe('excellent');
    });
  });
});
