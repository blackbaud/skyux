import { getProjects } from '@nx/devkit';

import { FsTree } from 'nx/src/generators/tree.js';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nx/devkit', async (importOriginal) => {
  const original = await importOriginal<typeof import('@nx/devkit')>();
  return {
    ...original,
    getProjects: vi.fn(),
    workspaceRoot: '/fake/workspace',
  };
});

vi.mock('nx/src/generators/tree.js', () => ({
  FsTree: vi.fn().mockImplementation(() => ({})),
}));

describe('getComponentProjectNames', () => {
  it('should return project names with component tag', async () => {
    const mockProjects = new Map([
      [
        'action-bars',
        {
          name: 'action-bars',
          tags: ['component'],
        },
      ],
      [
        'ag-grid',
        {
          name: 'ag-grid',
          tags: ['component', 'external'],
        },
      ],
      [
        'code-examples',
        {
          name: 'code-examples',
          tags: ['examples'],
        },
      ],
      [
        'forms',
        {
          name: 'forms',
          tags: ['component'],
        },
      ],
    ]);

    vi.mocked(getProjects).mockReturnValue(mockProjects as never);

    const { getComponentProjectNames } = await import(
      './get-component-project-names.js'
    );

    const result = getComponentProjectNames();

    expect(FsTree).toHaveBeenCalledWith('/fake/workspace', false);
    expect(result).toEqual(['action-bars', 'ag-grid', 'forms']);
  });

  it('should return empty array when no projects have component tag', async () => {
    const mockProjects = new Map([
      [
        'code-examples',
        {
          name: 'code-examples',
          tags: ['examples'],
        },
      ],
      [
        'playground',
        {
          name: 'playground',
          tags: ['app'],
        },
      ],
    ]);

    vi.mocked(getProjects).mockReturnValue(mockProjects as never);

    const { getComponentProjectNames } = await import(
      './get-component-project-names.js'
    );

    const result = getComponentProjectNames();

    expect(result).toEqual([]);
  });

  it('should handle projects without tags', async () => {
    const mockProjects = new Map([
      [
        'action-bars',
        {
          name: 'action-bars',
          tags: ['component'],
        },
      ],
      [
        'no-tags-project',
        {
          name: 'no-tags-project',
        },
      ],
    ]);

    vi.mocked(getProjects).mockReturnValue(mockProjects as never);

    const { getComponentProjectNames } = await import(
      './get-component-project-names.js'
    );

    const result = getComponentProjectNames();

    expect(result).toEqual(['action-bars']);
  });

  it('should handle empty projects map', async () => {
    const mockProjects = new Map();

    vi.mocked(getProjects).mockReturnValue(mockProjects as never);

    const { getComponentProjectNames } = await import(
      './get-component-project-names.js'
    );

    const result = getComponentProjectNames();

    expect(result).toEqual([]);
  });
});
