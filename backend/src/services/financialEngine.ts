export interface SplitResult {
  amountA: number;
  amountB: number;
}

export function calculateExpenseSplit(amount: number, splitRatioA: number, splitRatioB: number): SplitResult {
  const totalRatio = splitRatioA + splitRatioB;
  if (totalRatio === 0) return { amountA: 0, amountB: 0 };
  const amountA = Math.round((amount * (splitRatioA / totalRatio)) * 100) / 100;
  const amountB = Math.round((amount - amountA) * 100) / 100;
  return { amountA, amountB };
}

export function calculateSavingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0;
  const rate = ((income - expenses) / income) * 100;
  return Math.max(0, Math.round(rate * 10) / 10);
}

export interface ProjectionPoint {
  year: number;
  label: string;
  expectedValue: number;
  conservativeValue: number;
}

export function calculateProjections(
  currentWealth: number,
  monthlyContribution: number,
  expectedReturnAnnualRate: number = 10,
  conservativeReturnAnnualRate: number = 6.5
): ProjectionPoint[] {
  const monthlyRateExpected = Math.pow(1 + expectedReturnAnnualRate / 100, 1 / 12) - 1;
  const monthlyRateConservative = Math.pow(1 + conservativeReturnAnnualRate / 100, 1 / 12) - 1;

  const years = [0, 1, 3, 5, 10, 15, 20];
  
  return years.map(yr => {
    const months = yr * 12;
    
    // Future value formula: PV*(1+r)^n + PMT * (((1+r)^n - 1) / r)
    let expected = currentWealth * Math.pow(1 + monthlyRateExpected, months);
    if (monthlyRateExpected > 0 && months > 0) {
      expected += monthlyContribution * ((Math.pow(1 + monthlyRateExpected, months) - 1) / monthlyRateExpected);
    }

    let conservative = currentWealth * Math.pow(1 + monthlyRateConservative, months);
    if (monthlyRateConservative > 0 && months > 0) {
      conservative += monthlyContribution * ((Math.pow(1 + monthlyRateConservative, months) - 1) / monthlyRateConservative);
    }

    const label = yr === 0 ? 'Hoje' : `${yr} Anos`;
    return {
      year: yr,
      label,
      expectedValue: Math.round(expected),
      conservativeValue: Math.round(conservative),
    };
  });
}

export function calculateEmergencyFundRatio(currentEmergencyFund: number, monthlyFixedExpenses: number): {
  monthsCovered: number;
  targetSixMonths: number;
  percentage: number;
  status: 'critical' | 'good' | 'excellent';
} {
  const targetSixMonths = monthlyFixedExpenses * 6;
  const monthsCovered = monthlyFixedExpenses > 0 ? Math.round((currentEmergencyFund / monthlyFixedExpenses) * 10) / 10 : 0;
  const percentage = targetSixMonths > 0 ? Math.min(100, Math.round((currentEmergencyFund / targetSixMonths) * 100)) : 100;
  
  let status: 'critical' | 'good' | 'excellent' = 'critical';
  if (monthsCovered >= 6) status = 'excellent';
  else if (monthsCovered >= 3) status = 'good';

  return {
    monthsCovered,
    targetSixMonths,
    percentage,
    status
  };
}
