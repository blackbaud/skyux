import type { Mode } from 'highlight.js';
import hljs from 'highlight.js/lib/core';

import {
  SKY_CODE_BLOCK_LANGUAGE_ALIASES,
  SKY_CODE_BLOCK_LANGUAGE_LOADERS,
  SKY_CODE_BLOCK_SUB_LANGUAGES,
  loadCodeBlockLanguage,
} from './code-block-languages';

const PRISM_NAMES = ['markup', 'batch', 'plsql', 'shell'];

function collectSubLanguages(
  mode: Mode,
  found = new Set<string>(),
  visited = new Set<Mode>(),
): Set<string> {
  visited.add(mode);

  for (const name of [mode.subLanguage ?? []].flat()) {
    found.add(name);
  }

  const children = [
    ...(mode.contains ?? []),
    ...(mode.variants ?? []),
    mode.starts,
  ];

  for (const child of children) {
    // `contains` can hold the string 'self'.
    if (typeof child === 'object' && !visited.has(child)) {
      collectSubLanguages(child, found, visited);
    }
  }

  return found;
}

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

  it('should map Stache language names', async () => {
    await expectAsync(loadCodeBlockLanguage('markup')).toBeResolvedTo({
      name: 'xml',
      displayName: 'HTML, XML',
    });
    await expectAsync(loadCodeBlockLanguage('batch')).toBeResolvedTo(
      jasmine.objectContaining({ name: 'dos' }),
    );
    await expectAsync(loadCodeBlockLanguage('plsql')).toBeResolvedTo(
      jasmine.objectContaining({ name: 'sql' }),
    );
    await expectAsync(loadCodeBlockLanguage('shell')).toBeResolvedTo(
      jasmine.objectContaining({ name: 'bash' }),
    );
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

  it('should register sub-languages', async () => {
    await loadCodeBlockLanguage('markdown');

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

        if (!PRISM_NAMES.includes(key)) {
          claimants.set(key, [...(claimants.get(key) ?? []), name]);
        }
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

  it('should declare every sub-language a definition uses', async () => {
    for (const [name, load] of Object.entries(
      SKY_CODE_BLOCK_LANGUAGE_LOADERS,
    )) {
      const definition = (await load()).default(hljs);

      for (const subLanguage of collectSubLanguages(definition)) {
        if (subLanguage !== name) {
          expect(SKY_CODE_BLOCK_SUB_LANGUAGES[name] ?? [])
            .withContext(`sub-language "${subLanguage}" of ${name}`)
            .toContain(subLanguage);
        }
      }
    }
  });
});
