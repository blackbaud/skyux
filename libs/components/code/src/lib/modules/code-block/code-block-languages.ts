// cspell:ignore asciidoc gherkin
import type { HLJSApi } from 'highlight.js';
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

const DEFAULT_LANGUAGE = 'xml';

let highlighter: HLJSApi | undefined;

// A separate instance keeps these registrations from affecting other users of
// highlight.js in the same app.
function getHighlighter(): HLJSApi {
  if (!highlighter) {
    highlighter = hljs.newInstance();

    for (const [name, language] of Object.entries(LANGUAGES)) {
      highlighter.registerLanguage(name, language);
    }
  }

  return highlighter;
}

/**
 * Highlights code in a code block's `languageType`, which can be the name or
 * any alias of a supported language (for example, `typescript` or `ts`). Unset
 * and unsupported types are highlighted as xml without a display name, as
 * Stache did with its `markup` default.
 */
export function highlightCodeBlock(
  code: string,
  languageType: string | undefined,
): { html: string; displayName: string | undefined } {
  const highlighter = getHighlighter();
  // highlight.js resolves names and aliases case-insensitively.
  const language = languageType && highlighter.getLanguage(languageType);

  return {
    html: highlighter.highlight(code, {
      language: language ? (languageType as string) : DEFAULT_LANGUAGE,
    }).value,
    displayName: language ? language.name : undefined,
  };
}
