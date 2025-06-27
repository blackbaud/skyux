import { createTree } from 'nx/src/generators/testing-utils/create-tree';

import { updateJson } from './update-json';

describe('update-json', () => {
  it('should update json', () => {
    const tree = createTree();
    tree.write('file.json', JSON.stringify({ test: 'value' }));
    updateJson<{ test: string }>(tree, 'file.json', (value) => {
      value.test = 'updated';
      return value;
    });
    const data = JSON.parse(tree.read('file.json', 'utf-8') ?? 'null');
    expect(data.test).toEqual('updated');
  });
});
