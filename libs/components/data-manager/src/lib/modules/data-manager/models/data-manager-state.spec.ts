import { SkyDataManagerState } from './data-manager-state';

describe('SkyDataManagerState', () => {
  it('round-trips page and pageSize through getStateOptions', () => {
    const state = new SkyDataManagerState({ page: 3, pageSize: 25 });

    expect(state.page).toBe(3);
    expect(state.pageSize).toBe(25);
    expect(state.getStateOptions().page).toBe(3);
    expect(state.getStateOptions().pageSize).toBe(25);
  });

  it('defaults page and pageSize to undefined when not provided', () => {
    const state = new SkyDataManagerState({});

    expect(state.page).toBeUndefined();
    expect(state.pageSize).toBeUndefined();
  });
});
