describe('Workspace check', () => {
  it('should call workspaceCheck', async () => {
    const workspaceCheck = jest.fn();
    jest.mock('../../../rules/workspace-check/workspace-check', () => ({
      workspaceCheck,
    }));
    (await import('./workspace-check.schematic')).default();
    expect(workspaceCheck).toHaveBeenCalled();
  });
});
