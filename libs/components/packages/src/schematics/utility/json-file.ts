/* istanbul ignore file */

/**
 * The contents of this file were copied from '@schematics/angular'.
 * @see https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/utility/json-file.ts
 */
import { JsonValue } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';

import {
  Node,
  ParseError,
  applyEdits,
  findNodeAtLocation,
  getNodeValue,
  modify,
  parseTree,
  printParseErrorCode,
} from 'jsonc-parser';

export type InsertionIndex = (properties: string[]) => number;
export type JsonPath = (string | number)[];

/**
 * Handles JSONC files (JSON files that include comments).
 * @internal
 */
export class JsonFile {
  public content: string;

  private get JsonAst(): Node | undefined {
    if (this._jsonAst) {
      return this._jsonAst;
    }

    const errors: ParseError[] = [];
    this._jsonAst = parseTree(this.content, errors, {
      allowTrailingComma: true,
    });
    if (errors.length) {
      const { error, offset } = errors[0];
      throw new Error(
        `Failed to parse "${
          this.path
        }" as JSON AST Object. ${printParseErrorCode(
          error
        )} at location: ${offset}.`
      );
    }

    return this._jsonAst;
  }

  private _jsonAst: Node | undefined;

  constructor(private readonly host: Tree, private readonly path: string) {
    const buffer = this.host.read(this.path);
    if (buffer) {
      this.content = buffer.toString();
    } else {
      throw new Error(`Could not read '${path}'.`);
    }
  }

  public get(jsonPath: JsonPath): any {
    const jsonAstNode = this.JsonAst;
    if (!jsonAstNode) {
      return undefined;
    }

    if (jsonPath.length === 0) {
      return getNodeValue(jsonAstNode);
    }

    const node = findNodeAtLocation(jsonAstNode, jsonPath);

    return node === undefined ? undefined : getNodeValue(node);
  }

  public modify(
    jsonPath: JsonPath,
    value: JsonValue | undefined,
    insertInOrder?: InsertionIndex | false
  ): void {
    let getInsertionIndex: InsertionIndex | undefined;
    if (insertInOrder === undefined) {
      const property = jsonPath.slice(-1)[0];
      getInsertionIndex = (properties) =>
        [...properties, property].sort().findIndex((p) => p === property);
    } else if (insertInOrder !== false) {
      getInsertionIndex = insertInOrder;
    }

    const edits = modify(this.content, jsonPath, value, {
      getInsertionIndex,
      formattingOptions: {
        insertSpaces: true,
        tabSize: 2,
      },
    });

    this.content = applyEdits(this.content, edits);
    this.host.overwrite(this.path, this.content);
    this._jsonAst = undefined;
  }

  public remove(jsonPath: JsonPath): void {
    if (this.get(jsonPath) !== undefined) {
      this.modify(jsonPath, undefined);
    }
  }
}
