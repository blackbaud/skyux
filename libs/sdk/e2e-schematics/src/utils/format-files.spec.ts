import { formatFiles as nxFormatFiles } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { formatFiles } from './format-files';

jest.mock('@nx/devkit', () => ({
  formatFiles: jest.fn().mockResolvedValue(undefined),
}));

describe('format-files', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should format files correctly', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    const filePath = 'apps/cypress/src/support/e2e.ts';
    tree.write(filePath, `// Initial content\nimport '@percy/cypress';\n`);

    await formatFiles(tree);

    expect(nxFormatFiles).toHaveBeenCalledWith(tree);
  });

  it('should skip formatting', async () => {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    const filePath = 'apps/cypress/src/support/e2e.ts';
    tree.write(filePath, `// Initial content\nimport "@percy/cypress";\n`);

    await formatFiles(tree, { skipFormat: true });

    expect(nxFormatFiles).not.toHaveBeenCalled();
  });
});
