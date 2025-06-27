import { Tree, formatFiles as nxFormatFiles } from '@nx/devkit';

export async function formatFiles(
  tree: Tree,
  options?: { skipFormat?: boolean },
): Promise<void> {
  if (!options?.skipFormat) {
    await nxFormatFiles(tree);
  }
}
