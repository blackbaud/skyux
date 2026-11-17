// cspell:ignore haml mojolicious
import hljs from 'highlight.js/lib/core';

import {
  SKY_CODE_BLOCK_LANGUAGE_ALIASES,
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

  it('should resolve aliases case-insensitively', async () => {
    await expectAsync(loadCodeBlockLanguage('TS')).toBeResolvedTo({
      name: 'typescript',
      displayName: 'TypeScript',
    });
    await expectAsync(loadCodeBlockLanguage('cs')).toBeResolvedTo({
      name: 'csharp',
      displayName: 'C#',
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

  it("should match each language's own aliases", async () => {
    // A few aliases (e.g. "ls", "ml") are claimed by two languages.
    const claimants = new Map<string, string[]>();

    for (const [name, load] of Object.entries(
      SKY_CODE_BLOCK_LANGUAGE_LOADERS,
    )) {
      for (const alias of (await load()).default(hljs).aliases ?? []) {
        const key = alias.toLowerCase();

        claimants.set(key, [...(claimants.get(key) ?? []), name]);
      }
    }

    for (const [alias, names] of claimants) {
      expect(names)
        .withContext(`alias "${alias}"`)
        .toContain(SKY_CODE_BLOCK_LANGUAGE_ALIASES[alias]);
    }
  });

  it('should only alias to languages that have a loader', () => {
    for (const name of Object.values(SKY_CODE_BLOCK_LANGUAGE_ALIASES)) {
      expect(SKY_CODE_BLOCK_LANGUAGE_LOADERS[name]).toBeDefined();
    }
  });
});
