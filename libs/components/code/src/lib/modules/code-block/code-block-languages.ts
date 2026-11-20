// cspell:ignore asciidoc gherkin
import type { HLJSApi, Language } from 'highlight.js';
import hljs from 'highlight.js/lib/core';
import arduino from 'highlight.js/lib/languages/arduino';
import asciidoc from 'highlight.js/lib/languages/asciidoc';
import bash from 'highlight.js/lib/languages/bash';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import dos from 'highlight.js/lib/languages/dos';
import gherkin from 'highlight.js/lib/languages/gherkin';
import http from 'highlight.js/lib/languages/http';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import plaintext from 'highlight.js/lib/languages/plaintext';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

import { SkyCodeBlockLanguageType } from './code-block-language-type';

// The languages found in existing Stache code blocks across Blackbaud's GitHub
// and Azure DevOps repositories.
const LANGUAGES = {
  arduino,
  asciidoc,
  bash,
  csharp,
  css,
  dos,
  gherkin,
  http,
  java,
  javascript,
  json,
  markdown,
  php,
  plaintext,
  powershell,
  python,
  sql,
  typescript,
  xml,
  yaml,
};

// highlight.js names a few languages awkwardly ("php", "HTML, XML",
// "Batch file (DOS)"), so every language type gets its own label. `html`
// highlights with the xml grammar.
const LABELS: Record<SkyCodeBlockLanguageType, string> = {
  arduino: 'Arduino',
  asciidoc: 'AsciiDoc',
  bash: 'Bash',
  csharp: 'C#',
  css: 'CSS',
  dos: 'Batch',
  gherkin: 'Gherkin',
  html: 'HTML',
  http: 'HTTP',
  java: 'Java',
  javascript: 'JavaScript',
  json: 'JSON',
  markdown: 'Markdown',
  php: 'PHP',
  plaintext: 'Plain text',
  powershell: 'PowerShell',
  python: 'Python',
  sql: 'SQL',
  typescript: 'TypeScript',
  xml: 'XML',
  yaml: 'YAML',
};

// Unsupported values (only possible without type checking) aren't highlighted.
const FALLBACK_LANGUAGE = 'plaintext';

let highlighter: HLJSApi | undefined;

// The registered name of each language, so aliases (for example, `bat`) are
// labeled like the language they resolve to.
const languageNames = new Map<Language, string>();

// A separate instance keeps these registrations from affecting other users of
// highlight.js in the same app.
function getHighlighter(): HLJSApi {
  if (!highlighter) {
    highlighter = hljs.newInstance();

    for (const [name, grammar] of Object.entries(LANGUAGES)) {
      highlighter.registerLanguage(name, grammar);
      languageNames.set(highlighter.getLanguage(name) as Language, name);
    }
  }

  return highlighter;
}

/**
 * Highlights code in a code block's `languageType`. Untyped values can also be
 * highlight.js aliases of a supported language (for example, `ts`), which are
 * labeled like that language. Unsupported values are shown as plain text
 * without a display name.
 */
export function highlightCodeBlock(
  code: string,
  languageType: string | undefined,
): { html: string; displayName: string | undefined } {
  const highlighter = getHighlighter();
  const key = languageType?.toLowerCase() ?? '';
  // highlight.js resolves names and aliases (`html` is an xml alias).
  const language = key ? highlighter.getLanguage(key) : undefined;

  if (!language) {
    return {
      html: highlighter.highlight(code, { language: FALLBACK_LANGUAGE }).value,
      displayName: undefined,
    };
  }

  // `html` has its own label even though it's an xml alias.
  const supportedName = Object.hasOwn(LABELS, key)
    ? key
    : languageNames.get(language);

  return {
    html: highlighter.highlight(code, { language: key }).value,
    displayName: LABELS[supportedName as SkyCodeBlockLanguageType],
  };
}
