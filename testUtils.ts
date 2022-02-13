export const getMockSubsribers = (amount: number = 3) =>
  Array(amount)
    .fill(true)
    .map(() => jest.fn());
