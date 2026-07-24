import { Tree } from '@angular-devkit/schematics';
import { posix } from 'node:path';

import { JsonFile } from '../../../../utility/json-file';
import { visitProjectFiles } from '../../../../utility/visit-project-files';

const TSCONFIG_FILE_NAME_RE = /^tsconfig(\..+)?\.json$/;

export interface TsconfigInfo {
  path: string;
  dir: string;
  inNodeModules: boolean;
  extends: TsconfigInfo[];
  ownBaseUrl: string | undefined;
  ownPaths: Record<string, string[]> | undefined;
  json: JsonFile;
}

export interface EffectiveValue<T> {
  value: T;
  definedIn: TsconfigInfo;
}

export interface GoverningBaseUrl {
  baseUrlAbs: string;
  pathsPatterns: string[];
  conflictingConfigPaths: string[] | undefined;
}

function basename(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

function isPathsRecord(value: unknown): value is Record<string, string[]> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function resolveExtendsRef(
  tree: Tree,
  ref: string,
  fromDir: string,
): string | undefined {
  const candidates: string[] = ref.startsWith('.')
    ? [posix.resolve(fromDir, ref), `${posix.resolve(fromDir, ref)}.json`]
    : [
        `/node_modules/${ref}`,
        `/node_modules/${ref}.json`,
        `/node_modules/${ref}/tsconfig.json`,
      ];

  return candidates.find((candidate) => tree.exists(candidate));
}

function loadConfig(
  tree: Tree,
  path: string,
  configs: Map<string, TsconfigInfo>,
): TsconfigInfo {
  const existing = configs.get(path);
  if (existing) {
    return existing;
  }

  const json = new JsonFile(tree, path);
  const dir = posix.dirname(path);
  const ownBaseUrl = json.get(['compilerOptions', 'baseUrl']);
  const ownPaths = json.get(['compilerOptions', 'paths']);
  const rawExtends = json.get(['extends']);
  const rawExtendsList: string[] = Array.isArray(rawExtends)
    ? rawExtends
    : typeof rawExtends === 'string'
      ? [rawExtends]
      : [];

  const info: TsconfigInfo = {
    path,
    dir,
    inNodeModules: path.includes('/node_modules/'),
    extends: [],
    ownBaseUrl: typeof ownBaseUrl === 'string' ? ownBaseUrl : undefined,
    ownPaths: isPathsRecord(ownPaths) ? ownPaths : undefined,
    json,
  };
  configs.set(path, info);

  for (const ref of rawExtendsList) {
    const resolvedPath = resolveExtendsRef(tree, ref, dir);
    if (!resolvedPath) {
      continue;
    }

    info.extends.push(loadConfig(tree, resolvedPath, configs));
  }

  return info;
}

function preferenceRank(config: TsconfigInfo): number {
  return basename(config.path) === 'tsconfig.json' ? 0 : 1;
}

export class TsconfigModel {
  readonly #configs: Map<string, TsconfigInfo>;

  constructor(configs: Map<string, TsconfigInfo>) {
    this.#configs = configs;
  }

  public getAll(): TsconfigInfo[] {
    return [...this.#configs.values()];
  }

  public get(path: string): TsconfigInfo | undefined {
    return this.#configs.get(path);
  }

  public getEffectiveBaseUrl(
    config: TsconfigInfo,
  ): EffectiveValue<string> | undefined {
    return this.#resolveEffective(config, (c) => c.ownBaseUrl, new Set());
  }

  public getEffectivePaths(
    config: TsconfigInfo,
  ): EffectiveValue<Record<string, string[]>> | undefined {
    return this.#resolveEffective(config, (c) => c.ownPaths, new Set());
  }

  public getEffectiveOption(config: TsconfigInfo, name: string): unknown {
    const result = this.#resolveEffective(
      config,
      (c) => {
        const value = c.json.get(['compilerOptions', name]);
        return value === undefined ? undefined : value;
      },
      new Set(),
    );

    return result?.value;
  }

  public getGoverningBaseUrl(filePath: string): GoverningBaseUrl | undefined {
    let dir = posix.dirname(filePath);

    for (;;) {
      const candidates = this.getAll()
        .filter((c) => c.dir === dir)
        .sort(
          (a, b) =>
            preferenceRank(a) - preferenceRank(b) ||
            a.path.localeCompare(b.path),
        );

      const resolved = candidates
        .map((config) => {
          const effective = this.getEffectiveBaseUrl(config);
          if (!effective) {
            return undefined;
          }

          return {
            config,
            baseUrlAbs: posix.resolve(effective.definedIn.dir, effective.value),
            paths: this.getEffectivePaths(config),
          };
        })
        .filter((r): r is NonNullable<typeof r> => r !== undefined);

      if (resolved.length > 0) {
        const [first, ...rest] = resolved;
        const conflicting = rest.filter(
          (r) => r.baseUrlAbs !== first.baseUrlAbs,
        );

        return {
          baseUrlAbs: first.baseUrlAbs,
          pathsPatterns: Object.keys(first.paths?.value ?? {}),
          conflictingConfigPaths: conflicting.length
            ? conflicting.map((r) => r.config.path)
            : undefined,
        };
      }

      if (dir === '/') {
        return undefined;
      }

      dir = posix.dirname(dir);
    }
  }

  #resolveEffective<T>(
    config: TsconfigInfo,
    getOwn: (config: TsconfigInfo) => T | undefined,
    visited: Set<string>,
  ): EffectiveValue<T> | undefined {
    const own = getOwn(config);
    if (own !== undefined) {
      return { value: own, definedIn: config };
    }

    if (visited.has(config.path)) {
      return undefined;
    }
    visited.add(config.path);

    for (let i = config.extends.length - 1; i >= 0; i--) {
      const result = this.#resolveEffective(config.extends[i], getOwn, visited);
      if (result) {
        return result;
      }
    }

    return undefined;
  }
}

export function buildTsconfigModel(tree: Tree): TsconfigModel {
  const discovered: string[] = [];

  visitProjectFiles(tree, '/', (filePath) => {
    if (TSCONFIG_FILE_NAME_RE.test(basename(filePath))) {
      discovered.push(filePath);
    }
  });

  const configs = new Map<string, TsconfigInfo>();
  for (const path of discovered) {
    loadConfig(tree, path, configs);
  }

  return new TsconfigModel(configs);
}
