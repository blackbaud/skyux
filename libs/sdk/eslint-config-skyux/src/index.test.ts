jest.mock('@skyux/manifest', () => {
  const original = jest.requireActual('@skyux/manifest');

  return {
    ...original,
    getPublicApi: jest.fn().mockReturnValue({
      packages: {},
    }),
  };
});

const config = require('../dev-transpiler.cjs');

describe('index.ts', () => {
  it('should match snapshot', () => {
    expect(config).toMatchSnapshot();
  });
});
