import {
  type Mock,
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { pruneIconSprite } from './prune-icon-sprite';

vi.mock('@percy/cypress', () => ({}));

type PercySnapshotOverwrite = (
  percySnapshot: Mock,
  ...args: unknown[]
) => unknown;

describe('percySnapshot command', () => {
  let overwriteCalls: unknown[][];
  let percySnapshotOverwrite: PercySnapshotOverwrite;

  beforeAll(async () => {
    const overwrite = vi.fn();
    vi.stubGlobal('Cypress', { Commands: { overwrite } });

    await import('./percy-snapshot-command');

    // Vitest clears mock call history before each test, so capture it here.
    overwriteCalls = [...overwrite.mock.calls];
    percySnapshotOverwrite = overwriteCalls[0][1] as PercySnapshotOverwrite;
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('should overwrite the percySnapshot command', () => {
    expect(overwriteCalls).toEqual([['percySnapshot', expect.any(Function)]]);
  });

  it('should prune the icon sprite from the snapshot', () => {
    const percySnapshot = vi.fn();

    percySnapshotOverwrite(percySnapshot, 'snapshot name');

    expect(percySnapshot).toHaveBeenCalledWith('snapshot name', {
      domTransformation: pruneIconSprite,
    });
  });

  it('should pass along the snapshot options', () => {
    const percySnapshot = vi.fn();

    percySnapshotOverwrite(percySnapshot, 'snapshot name', { widths: [375] });

    expect(percySnapshot).toHaveBeenCalledWith('snapshot name', {
      domTransformation: pruneIconSprite,
      widths: [375],
    });
  });

  it('should let the snapshot options replace the DOM transformation', () => {
    const percySnapshot = vi.fn();
    const domTransformation = '(documentElement) => {}';

    percySnapshotOverwrite(percySnapshot, 'snapshot name', {
      domTransformation,
    });

    expect(percySnapshot).toHaveBeenCalledWith('snapshot name', {
      domTransformation,
    });
  });

  it('should accept the snapshot options as the first argument', () => {
    const percySnapshot = vi.fn();

    percySnapshotOverwrite(percySnapshot, { widths: [375] });

    expect(percySnapshot).toHaveBeenCalledWith(undefined, {
      domTransformation: pruneIconSprite,
      widths: [375],
    });
  });

  it('should return the result of the original command', () => {
    const chainable = {};
    const percySnapshot = vi.fn().mockReturnValue(chainable);

    expect(percySnapshotOverwrite(percySnapshot, 'snapshot name')).toBe(
      chainable,
    );
  });
});
