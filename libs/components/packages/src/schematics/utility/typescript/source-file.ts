import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

export function createSourceFile(
  filePath: string,
  fileContents: string,
): ts.SourceFile {
  return ts.createSourceFile(
    filePath,
    fileContents,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );
}
