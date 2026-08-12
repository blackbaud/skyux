import { reconcileColumnState } from './data-manager-column-state';

describe('reconcileColumnState', () => {
  const columns = [
    { id: 'locked', alwaysDisplayed: true },
    { id: 'name' },
    { id: 'age' },
    { id: 'notes', initialHide: true },
  ];

  it('should use the declared visibility when nothing is stored', () => {
    expect(reconcileColumnState(undefined, columns)).toEqual({
      columnIds: ['locked', 'name', 'age', 'notes'],
      displayedColumnIds: ['locked', 'name', 'age'],
    });
  });

  it('should use the declared visibility when the stored state is empty', () => {
    expect(
      reconcileColumnState({ columnIds: [], displayedColumnIds: [] }, columns),
    ).toEqual({
      columnIds: ['locked', 'name', 'age', 'notes'],
      displayedColumnIds: ['locked', 'name', 'age'],
    });
  });

  it('should keep the stored order', () => {
    expect(
      reconcileColumnState(
        {
          columnIds: ['locked', 'name', 'age', 'notes'],
          displayedColumnIds: ['locked', 'age', 'name'],
        },
        columns,
      ).displayedColumnIds,
    ).toEqual(['locked', 'age', 'name']);
  });

  it('should keep a column the user hid hidden', () => {
    expect(
      reconcileColumnState(
        {
          columnIds: ['locked', 'name', 'age', 'notes'],
          displayedColumnIds: ['locked', 'name'],
        },
        columns,
      ).displayedColumnIds,
    ).toEqual(['locked', 'name']);
  });

  it('should display a column added since the state was stored', () => {
    expect(
      reconcileColumnState(
        {
          columnIds: ['locked', 'name'],
          displayedColumnIds: ['locked', 'name'],
        },
        columns,
      ).displayedColumnIds,
    ).toEqual(['locked', 'name', 'age']);
  });

  it('should not display a newly added column that starts hidden', () => {
    expect(
      reconcileColumnState(
        {
          columnIds: ['locked', 'name', 'age'],
          displayedColumnIds: ['locked', 'name', 'age'],
        },
        columns,
      ).displayedColumnIds,
    ).not.toContain('notes');
  });

  it('should drop a column that no longer exists', () => {
    expect(
      reconcileColumnState(
        {
          columnIds: ['locked', 'name', 'age', 'notes', 'removed'],
          displayedColumnIds: ['locked', 'name', 'removed'],
        },
        columns,
      ),
    ).toEqual({
      columnIds: ['locked', 'name', 'age', 'notes'],
      displayedColumnIds: ['locked', 'name'],
    });
  });

  it('should take the stored list at face value when no column IDs were stored', () => {
    // Without stored column IDs there is no way to tell a new column from one
    // the user hid, so nothing is added.
    expect(
      reconcileColumnState({ displayedColumnIds: ['locked', 'name'] }, columns)
        .displayedColumnIds,
    ).toEqual(['locked', 'name']);
  });

  it('should always display a column that cannot be hidden', () => {
    expect(
      reconcileColumnState(
        {
          columnIds: ['locked', 'name', 'age', 'notes'],
          displayedColumnIds: ['name', 'age'],
        },
        columns,
      ).displayedColumnIds,
    ).toEqual(['locked', 'name', 'age']);
  });

  it('should display multiple always-displayed columns in declaration order', () => {
    expect(
      reconcileColumnState(
        {
          columnIds: ['a', 'b', 'name'],
          displayedColumnIds: ['name'],
        },
        [
          { id: 'a', alwaysDisplayed: true },
          { id: 'b', alwaysDisplayed: true },
          { id: 'name' },
        ],
      ).displayedColumnIds,
    ).toEqual(['a', 'b', 'name']);
  });
});
