import {
  Rule,
  SchematicContext,
  Tree,
  UpdateRecorder,
} from '@angular-devkit/schematics';
import stylesJson from '@blackbaud/skyux-design-tokens/bundles/public-api-styles.json';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import {
  ElementWithLocation,
  ParentNode,
  isParentNode,
  parseTemplate,
} from '../../../utility/template';
import {
  getInlineTemplates,
  parseSourceFile,
} from '../../../utility/typescript/ng-ast';
import { visitProjectFiles } from '../../../utility/visit-project-files';

import { PublicApiStyle } from './types/public-api-style';
import { PublicApiStyleGroup } from './types/public-api-style-group';
import { PublicApiStyles } from './types/public-api-styles';

function isElement(node: unknown): node is ElementWithLocation {
  return !!node && typeof node === 'object' && 'tagName' in node;
}

/**
 * Recursively collects all styles from the nested group structure.
 */
function collectStyles(
  groups: PublicApiStyleGroup[] | undefined,
  styles: PublicApiStyle[] | undefined,
): PublicApiStyle[] {
  const result: PublicApiStyle[] = [];

  if (styles) {
    result.push(...styles);
  }

  if (groups) {
    for (const group of groups) {
      result.push(...collectStyles(group.groups, group.styles));
    }
  }

  return result;
}

/**
 * Builds a map of obsolete class names to their current replacements.
 */
function buildObsoleteClassMap(json: PublicApiStyles): Map<string, string> {
  const classMap = new Map<string, string>();
  const allStyles = collectStyles(json.groups, json.styles);

  for (const style of allStyles) {
    if (style.obsoleteClassNames && style.className) {
      for (const obsolete of style.obsoleteClassNames) {
        classMap.set(obsolete, style.className);
      }
    }
  }

  return classMap;
}

/**
 * Replaces obsolete tokens in a static `class` attribute value.
 */
function replaceStaticClassAttr(
  node: ElementWithLocation,
  content: string,
  recorder: UpdateRecorder,
  offset: number,
  classMap: Map<string, string>,
): boolean {
  const attrs = node.sourceCodeLocation.attrs;
  const classAttr = node.attrs.find((a) => a.name === 'class');

  if (!attrs['class'] || !classAttr) {
    return false;
  }

  const loc = attrs['class'];
  const rawText = content.substring(loc.startOffset, loc.endOffset);
  const valueStartOffset = loc.startOffset + rawText.indexOf(classAttr.value);
  const valueEndOffset = valueStartOffset + classAttr.value.length;

  const tokens = classAttr.value.split(/(\s+)/);
  let hasReplacement = false;

  const newTokens = tokens.map((token) => {
    const replacement = classMap.get(token);

    if (replacement) {
      hasReplacement = true;
      return replacement;
    }

    return token;
  });

  if (hasReplacement) {
    recorder.remove(
      offset + valueStartOffset,
      valueEndOffset - valueStartOffset,
    );
    recorder.insertLeft(offset + valueStartOffset, newTokens.join(''));
  }

  return hasReplacement;
}

/**
 * Replaces obsolete class names in `[class.sky-old-class]` bindings.
 */
function replaceClassBindings(
  node: ElementWithLocation,
  content: string,
  recorder: UpdateRecorder,
  offset: number,
  classMap: Map<string, string>,
): boolean {
  const attrs = node.sourceCodeLocation.attrs;
  let changed = false;

  for (const attr of node.attrs) {
    const match = attr.name.match(/^\[class\.(.+)\]$/);
    const className = match?.[1];
    const replacement = className ? classMap.get(className) : undefined;

    if (match && replacement) {
      const loc = attrs[attr.name];
      const newAttrName = `[class.${replacement}]`;
      const rawAttr = content.substring(loc.startOffset, loc.endOffset);
      const nameLength = rawAttr.indexOf('=');

      recorder.remove(offset + loc.startOffset, nameLength);
      recorder.insertLeft(offset + loc.startOffset, newAttrName);
      changed = true;
    }
  }

  return changed;
}

/**
 * Replaces obsolete class names inside `[ngClass]` expression values.
 */
function replaceNgClassExpression(
  node: ElementWithLocation,
  content: string,
  recorder: UpdateRecorder,
  offset: number,
  classMap: Map<string, string>,
): boolean {
  const attrs = node.sourceCodeLocation.attrs;
  let changed = false;

  for (const attr of node.attrs) {
    if (attr.name !== '[ngclass]') {
      continue;
    }

    const loc = attrs[attr.name];
    const rawText = content.substring(loc.startOffset, loc.endOffset);
    const absValueStart = loc.startOffset + rawText.indexOf(attr.value);

    let newValue = attr.value;
    let hasReplacement = false;

    for (const [obsolete, replacement] of classMap) {
      const escaped = obsolete.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const pattern = new RegExp(`(?<=['"\`])${escaped}(?=['"\`])`, 'g');

      if (pattern.test(newValue)) {
        hasReplacement = true;
        newValue = newValue.replace(pattern, replacement);
      }
    }

    if (hasReplacement) {
      recorder.remove(offset + absValueStart, attr.value.length);
      recorder.insertLeft(offset + absValueStart, newValue);
      changed = true;
    }
  }

  return changed;
}

/**
 * Collects all element nodes from a parsed template.
 */
function getAllElements(document: ParentNode): ElementWithLocation[] {
  const elements: ElementWithLocation[] = [];
  const queue: (ElementWithLocation | ParentNode)[] = [document];

  while (queue.length) {
    const current = queue.shift();

    if (isElement(current)) {
      elements.push(current);
    }

    if (isParentNode(current)) {
      for (const child of current.childNodes) {
        if (isElement(child) || isParentNode(child)) {
          queue.push(child as ElementWithLocation | ParentNode);
        }
      }
    }
  }

  return elements;
}

/**
 * Replaces obsolete class names inside an HTML template using parse5 for
 * surgical, AST-based replacements.
 */
function replaceClassesInHtml(
  content: string,
  recorder: UpdateRecorder,
  offset: number,
  classMap: Map<string, string>,
): boolean {
  const document = parseTemplate(content);
  let changed = false;

  for (const node of getAllElements(document)) {
    if (!node.sourceCodeLocation?.attrs) {
      continue;
    }

    if (replaceStaticClassAttr(node, content, recorder, offset, classMap)) {
      changed = true;
    }

    if (replaceClassBindings(node, content, recorder, offset, classMap)) {
      changed = true;
    }

    if (replaceNgClassExpression(node, content, recorder, offset, classMap)) {
      changed = true;
    }
  }

  return changed;
}

/**
 * Processes an HTML file for obsolete CSS class replacements.
 */
function processHtmlFile(
  tree: Tree,
  filePath: string,
  classMap: Map<string, string>,
  context: SchematicContext,
): void {
  const content = tree.readText(filePath);
  const recorder = tree.beginUpdate(filePath);

  const changed = replaceClassesInHtml(content, recorder, 0, classMap);

  if (changed) {
    context.logger.info(`Updated CSS classes in ${filePath}`);
  }

  tree.commitUpdate(recorder);
}

/**
 * Processes a TypeScript file for obsolete CSS class replacements
 * in inline component templates.
 */
function processTypescriptFile(
  tree: Tree,
  filePath: string,
  classMap: Map<string, string>,
  context: SchematicContext,
): void {
  const sourceFile = parseSourceFile(tree, filePath);
  const inlineTemplates = getInlineTemplates(sourceFile);

  if (inlineTemplates.length === 0) {
    return;
  }

  const content = tree.readText(filePath);
  const recorder = tree.beginUpdate(filePath);
  let changed = false;

  for (const template of inlineTemplates) {
    const templateContent = content.substring(template.start, template.end);
    if (
      replaceClassesInHtml(templateContent, recorder, template.start, classMap)
    ) {
      changed = true;
    }
  }

  if (changed) {
    context.logger.info(`Updated CSS classes in ${filePath}`);
  }

  tree.commitUpdate(recorder);
}

/**
 * Processes a stylesheet file for obsolete CSS class selector replacements.
 */
function processStylesheet(
  tree: Tree,
  filePath: string,
  classMap: Map<string, string>,
  context: SchematicContext,
): void {
  const content = tree.readText(filePath);
  const recorder = tree.beginUpdate(filePath);
  let changed = false;

  for (const [obsolete, replacement] of classMap) {
    // Match `.obsolete-class` as a CSS selector (preceded by `.`,
    // followed by a non-identifier character or end-of-string).
    const escapedObsolete = obsolete.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const pattern = new RegExp(
      `\\.${escapedObsolete}(?=[^a-zA-Z0-9_-]|$)`,
      'g',
    );

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      // Replace only the class name portion (after the `.`).
      const classNameStart = match.index + 1; // skip the `.`
      recorder.remove(classNameStart, obsolete.length);
      recorder.insertLeft(classNameStart, replacement);
      changed = true;
    }
  }

  if (changed) {
    context.logger.info(`Updated CSS class selectors in ${filePath}`);
  }

  tree.commitUpdate(recorder);
}

/**
 * Replaces obsolete SKY UX CSS class names with their current equivalents
 * in HTML templates, inline component templates, and stylesheets across
 * all workspace projects. Reads the obsolete-to-current mappings from
 * `@blackbaud/skyux-design-tokens/bundles/public-api-styles.json`.
 */
export default function replaceObsoleteCssClasses(): Rule {
  return async (tree, context) => {
    const classMap = buildObsoleteClassMap(stylesJson as PublicApiStyles);
    const workspace = await getWorkspace(tree);

    workspace.projects.forEach((project) => {
      visitProjectFiles(tree, project.root, (filePath) => {
        if (filePath.endsWith('.html')) {
          processHtmlFile(tree, filePath, classMap, context);
        } else if (filePath.endsWith('.ts')) {
          processTypescriptFile(tree, filePath, classMap, context);
        } else if (filePath.endsWith('.scss') || filePath.endsWith('.css')) {
          processStylesheet(tree, filePath, classMap, context);
        }
      });
    });
  };
}
