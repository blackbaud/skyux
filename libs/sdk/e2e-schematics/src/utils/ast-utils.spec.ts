import { createTree } from 'nx/src/generators/testing-utils/create-tree';

import {
  applyTransformers,
  getInsertStringPropertyTransformer,
  getRenameVariablesTransformer,
  getSourceAsString,
  getStringLiteral,
  getStringLiteralsSetterTransformer,
  readSourceFile,
  writeSourceFile,
} from './ast-utils';

describe('ast-utils', () => {
  it('should rename a variable', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(fileName, `const test: string = "value";\nconsole.log(test);\n`);
    const sourceFile = readSourceFile(tree, fileName);
    const transformer = getRenameVariablesTransformer({ test: 'update' });
    const [result] = applyTransformers([sourceFile], [transformer]);
    const resultCode = getSourceAsString(result);
    expect(resultCode).toEqual(
      `const update: string = "value";\nconsole.log(update);\n`
    );
    writeSourceFile(tree, fileName, result);
    expect(tree.read(fileName, 'utf-8')).toEqual(resultCode);
  });

  it('should getStringLiteral', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(
      fileName,
      `const test: string = "value";\nconst obj = { property: "prop" };\n`
    );
    const sourceFile = readSourceFile(tree, fileName);
    const value = getStringLiteral(sourceFile, 'test');
    expect(value).toEqual('value');
    const prop = getStringLiteral(sourceFile, 'property');
    expect(prop).toEqual('prop');
  });

  it('should getStringLiteral, throw error', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(
      fileName,
      `const test: string = "value";\nconst obj = { property: "prop" };\n`
    );
    const sourceFile = readSourceFile(tree, fileName);
    try {
      getStringLiteral(sourceFile, 'bogus');
      fail();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('should setStringLiterals', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(
      fileName,
      `const test: string = "value";\nconst obj = { property: "prop" };\n`
    );
    const transformer = getStringLiteralsSetterTransformer({
      test: 'new value',
      property: 'updated',
    });
    const sourceFile = readSourceFile(tree, fileName);
    const [result] = applyTransformers([sourceFile], [transformer]);
    writeSourceFile(tree, fileName, result);
    expect(tree.read(fileName, 'utf-8')).toEqual(
      `const test: string = "new value";\nconst obj = { property: "updated" };\n`
    );
  });

  it('should insertStringPropertyBefore', () => {
    const tree = createTree();
    const fileName = 'script.ts';
    tree.write(fileName, `const test = { test: "value", property: "prop" };\n`);
    const sourceFile = readSourceFile(tree, fileName);
    const transformerTest = getInsertStringPropertyTransformer(
      'test',
      'id',
      'updated'
    );
    const transformerBogus = getInsertStringPropertyTransformer(
      'bogus',
      'added',
      'miss'
    );
    const [result] = applyTransformers(
      [sourceFile],
      [transformerTest, transformerBogus]
    );
    writeSourceFile(tree, fileName, result);
    expect(tree.read(fileName, 'utf-8')).toEqual(
      `const test = { id: "updated", test: "value", property: "prop" };\n`
    );
  });
});
