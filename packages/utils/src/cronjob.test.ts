import { isCronjobSpecification, isCronjobSpecificationArray } from './cronjob';

describe('Cronjob Utilities', () => {
  it('returns true for a valid cronjob specification', () => {
    const cronjobSpecification = {
      expression: '* * * * *',
      request: {
        method: 'exampleMethodOne',
        params: ['p1'],
      },
    };
    expect(isCronjobSpecification(cronjobSpecification)).toBe(true);
  });

  it('returns false for an invalid cronjob specification', () => {
    const cronjobSpecification = {
      expression: '* * * * * * * * * * *',
      request: {
        method: 'exampleMethodOne',
        params: ['p1'],
      },
    };
    expect(isCronjobSpecification(cronjobSpecification)).toBe(false);
  });

  it('returns true for a valid cronjob specification array', () => {
    const cronjobSpecificationArray = [
      {
        expression: '* * * * *',
        request: {
          method: 'exampleMethodOne',
          params: ['p1'],
        },
      },
    ];
    expect(isCronjobSpecificationArray(cronjobSpecificationArray)).toBe(true);
  });

  it('returns false for an invalid cronjob specification array', () => {
    const cronjobSpecificationArray = {
      expression: '* * * * *',
      request: {
        method: 'exampleMethodOne',
        params: ['p1'],
      },
    };
    expect(isCronjobSpecificationArray(cronjobSpecificationArray)).toBe(false);
  });
});
