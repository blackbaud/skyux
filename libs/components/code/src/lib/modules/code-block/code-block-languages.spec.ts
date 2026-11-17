// cspell:ignore haml mojolicious Naur
import hljs from 'highlight.js/lib/core';

import {
  SKY_CODE_BLOCK_LANGUAGE_LOADERS,
  loadCodeBlockLanguage,
} from './code-block-languages';

describe('Code block languages', () => {
  it('should resolve a highlight.js name', async () => {
    await expectAsync(loadCodeBlockLanguage('typescript')).toBeResolvedTo({
      name: 'typescript',
      displayName: 'TypeScript',
    });
  });

  it('should resolve names case-insensitively', async () => {
    await expectAsync(loadCodeBlockLanguage('TypeScript')).toBeResolvedTo({
      name: 'typescript',
      displayName: 'TypeScript',
    });
  });

  it('should load every highlight.js language', async () => {
    for (const [name, load] of Object.entries(
      SKY_CODE_BLOCK_LANGUAGE_LOADERS,
    )) {
      expect((await load()).default(hljs))
        .withContext(name)
        .toEqual(jasmine.any(Object));
    }
  });

  it('should treat object property names as unknown', async () => {
    await expectAsync(loadCodeBlockLanguage('constructor')).toBeResolvedTo({
      name: 'xml',
      displayName: undefined,
    });
  });

  it('should treat highlight.js aliases as unknown', async () => {
    await expectAsync(loadCodeBlockLanguage('ts')).toBeResolvedTo({
      name: 'xml',
      displayName: undefined,
    });
  });

  it('should use highlight.js names rather than Stache language names', async () => {
    await expectAsync(loadCodeBlockLanguage('shell')).toBeResolvedTo({
      name: 'shell',
      displayName: 'Shell Session',
    });
    await expectAsync(loadCodeBlockLanguage('markup')).toBeResolvedTo({
      name: 'xml',
      displayName: undefined,
    });
  });

  it('should fall back to xml without a display name', async () => {
    await expectAsync(loadCodeBlockLanguage(undefined)).toBeResolvedTo({
      name: 'xml',
      displayName: undefined,
    });
    await expectAsync(loadCodeBlockLanguage('xml1')).toBeResolvedTo({
      name: 'xml',
      displayName: undefined,
    });
  });

  it('should register the languages a language embeds', async () => {
    // haml embeds ruby, which no other spec loads.
    await loadCodeBlockLanguage('haml');

    expect(hljs.getLanguage('ruby')).toBeDefined();
  });

  it('should register languages that embed each other', async () => {
    // perl embeds mojolicious, which embeds perl and xml.
    await loadCodeBlockLanguage('perl');

    expect(hljs.getLanguage('mojolicious')).toBeDefined();
    expect(hljs.getLanguage('xml')).toBeDefined();
  });

  it('should retry a language that failed to load', async () => {
    // abnf isn't loaded by any other spec.
    const load = SKY_CODE_BLOCK_LANGUAGE_LOADERS['abnf'];
    const loadSpy = spyOn(SKY_CODE_BLOCK_LANGUAGE_LOADERS, 'abnf');

    loadSpy.and.rejectWith(new Error('Chunk failed to load.'));

    await expectAsync(loadCodeBlockLanguage('abnf')).toBeRejectedWithError(
      'Chunk failed to load.',
    );

    loadSpy.and.callFake(load);

    await expectAsync(loadCodeBlockLanguage('abnf')).toBeResolvedTo({
      name: 'abnf',
      displayName: 'Augmented Backus-Naur Form',
    });
  });
});
