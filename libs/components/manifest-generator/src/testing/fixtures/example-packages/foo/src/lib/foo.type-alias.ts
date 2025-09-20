import { Component } from '@angular/core';

/**
 * This is the Foo type alias.
 */
export type FooAlias = 'foo' | true | 0 | undefined | null;

/**
 * This type references a type from another package (i.e., ReferenceType).
 */
export type FooReferenceTypeAlias = string | keyof Component;
