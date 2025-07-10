import { Logger } from '../verify-e2e/verify-e2e';

interface Build {
  id: string;
  type: 'builds';
  attributes: {
    'build-number': number;
    partial: boolean;
    'web-url': string;
    'commit-html-url': string;
    'branch-html-url': string;
    'pull-request-html-url': string;
    state: string;
    'review-state': string;
    'review-state-reason': string;
    'is-pull-request': boolean;
    'pull-request-number': number;
    'pull-request-title': string;
    'total-snapshots': number;
    'total-open-comments': number;
    'failed-snapshots-count': number;
    'failure-reason': string;
    'failure-details': string;
    'finished-at': string;
    'finalized-at': string;
    'approved-at': string;
    'created-at': string;
    'updated-at': string;
  };
}

export interface BuildSummary {
  project: string;
  state:
    | 'unsaved'
    | 'pending'
    | 'processing'
    | 'finished'
    | 'failed'
    | 'expired'
    | 'waiting'
    | undefined;
  approved: boolean;
  removedSnapshots: string[];
}

export type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type FetchJson = <T extends object>(url: string, name: string) => Promise<T>;

interface Snapshot {
  type: 'snapshots';
  id: string;
  attributes: {
    name: string;
  };
}

function getFetchJson(
  fetchClient: (input: RequestInfo | URL) => Promise<Response>,
): FetchJson {
  return async (url: string, name: string) => {
    return await fetchClient(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } else {
          return Promise.reject(
            `Error fetching ${name}: ${JSON.stringify(res, null, 2)}`,
          );
        }
      })
      .catch((error) => {
        return Promise.reject(
          new Error(`Error fetching ${name}`, { cause: error }),
        );
      });
  };
}

export async function checkPercyBuild(
  project: string,
  buildId: string,
  logger: Logger,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch,
): Promise<Partial<BuildSummary>> {
  const fetchJson = getFetchJson(fetchClient);

  try {
    const build = await getBuild(buildId, fetchJson);

    if (build?.id && `${build.id}` === `${buildId}`) {
      const finished = build.attributes.state === 'finished';
      const approved =
        finished && build.attributes['review-state'] === 'approved';
      const removedSnapshots = finished
        ? await getRemovedSnapshots(build.id, fetchJson)
        : [];

      return {
        project,
        state: build.attributes.state as BuildSummary['state'],
        approved,
        removedSnapshots,
      };
    } else {
      logger.warning(`No Percy build found for ${project} build ${buildId}`);
    }
  } catch (error) {
    logger.error(`Error checking Percy build\n\n${(error as Error).stack}`);
  }
  return {
    project,
    state: undefined,
    approved: false,
    removedSnapshots: [],
  };
}

function buildIsApproved(previousBuild: Build | undefined): boolean {
  if (previousBuild?.id) {
    return (
      previousBuild.attributes.state === 'finished' &&
      previousBuild.attributes['review-state'] === 'approved' &&
      ![
        'changes_requested_snapshot',
        'changes_requested_snapshot_previously',
        'failed_snapshots',
        'missing_snapshots',
        'unreviewed_snapshots',
        'user_rejected',
      ].includes(previousBuild.attributes['review-state-reason'])
    );
  }
  return false;
}

/**
 * Called from .github/actions/e2e-affected/action.yml
 */
export async function getLastGoodPercyBuild(
  project: string,
  shaArray: string[],
  allowDeletedScreenshots: boolean,
  logger: Logger,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch,
): Promise<{ lastGoodCommit: string; buildId: number }> {
  if (shaArray.length === 0) {
    return { lastGoodCommit: '', buildId: 0 };
  }
  const fetchJson = getFetchJson(fetchClient);
  try {
    const projectId = await getProjectId(project, logger, fetchJson);
    const [previousBuild] = await getBuilds(
      projectId,
      shaArray,
      [],
      1,
      fetchJson,
    );
    if (buildIsApproved(previousBuild)) {
      logger.info(`Found ${previousBuild.attributes['web-url']}`);
      if (!allowDeletedScreenshots) {
        const removedSnapshots = await getRemovedSnapshots(
          previousBuild.id,
          fetchJson,
        );
        if (removedSnapshots.length > 0) {
          // Force the build to re-run.
          logger.warning(
            `Percy build ${previousBuild?.id} has removed screenshots. Re-running.`,
          );
          return { lastGoodCommit: '', buildId: 0 };
        }
      }
      const lastGoodCommit = previousBuild.attributes['commit-html-url']
        .split('/')
        .pop() as string;
      const buildId = Number(
        previousBuild.attributes['web-url'].split('/').pop(),
      );
      return { lastGoodCommit, buildId };
    }
    logger.warning(
      `The last build was not finished and/or approved. Re-running.`,
    );
  } catch (error) {
    logger.error(`Error checking Percy: ${error}`);
  }
  return { lastGoodCommit: '', buildId: 0 };
}

/**
 * Called from .github/actions/e2e-affected/action.yml
 */
export async function getPercyTargetCommit(
  project: string,
  shaArray: string[],
  logger: Logger,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch,
): Promise<string> {
  if (shaArray.length === 0) {
    return '';
  }
  const fetchJson = getFetchJson(fetchClient);

  function chunk(shaArray: string[], number: number): string[][] {
    const result = [];
    for (let i = 0; i < shaArray.length; i += number) {
      result.push(shaArray.slice(i, i + number));
    }
    return result;
  }

  const shaArrayBatchesOf25 = chunk(shaArray, 25);
  try {
    const projectId = await getProjectId(project, logger, fetchJson);
    for (const shaArrayBatch of shaArrayBatchesOf25) {
      const build = await getBuilds(
        projectId,
        shaArrayBatch,
        ['finished'],
        1,
        fetchJson,
      ).then((builds) => builds.pop());
      if (build?.id) {
        return build.attributes['commit-html-url'].split('/').pop() as string;
      }
    }
    return '';
  } catch (error) {
    logger.error(`Error checking Percy: ${error}`);
    return '';
  }
}

async function getProjectId(
  slug: string,
  logger: Logger,
  fetchJson: FetchJson,
): Promise<string> {
  return await fetchJson<{ id: string }>(
    `https://percy.io/api/v1/projects?project_slug=${slug}`,
    'Percy project ID',
  ).then((response) => {
    if (response.id) {
      return response.id;
    } else {
      logger.error(
        `Percy project ID response for ${slug}: ${JSON.stringify(response)}`,
      );
      return Promise.reject(
        `Percy project ID response for ${slug}: ${JSON.stringify(response)}`,
      );
    }
  });
}

async function getBuilds(
  projectId: string,
  shas: string[],
  states: string[],
  limit: number,
  fetchJson: FetchJson,
): Promise<Build[]> {
  const shaFilter = shas.map((sha) => `&filter[shas][]=${sha}`).join('');
  const stateFilter = states
    .map((state) => `&filter[state][]=${state}`)
    .join('');
  return await fetchJson<Build[]>(
    `https://percy.io/api/v1/builds?project_id=${projectId}${shaFilter}${stateFilter}&page[limit]=${limit}`,
    'Percy builds',
  ).then((builds) => builds.filter((build) => build.type === 'builds'));
}

async function getBuild(
  buildId: string,
  fetchJson: FetchJson,
): Promise<Build | undefined> {
  return await fetchJson<Build>(
    `https://percy.io/api/v1/builds/${buildId}`,
    `Percy build ${buildId}`,
  ).then((build) => {
    if (build.type === 'builds') {
      return build;
    }
    return undefined;
  });
}

async function getRemovedSnapshots(
  buildId: string,
  fetchJson: FetchJson,
): Promise<string[]> {
  return await fetchJson<Snapshot[]>(
    `https://percy.io/api/v1/builds/${buildId}/removed-snapshots`,
    'removed snapshots',
  ).then((response) =>
    response
      .filter((snapshot) => snapshot.type === 'snapshots')
      .map((snapshot: Snapshot) => snapshot.attributes.name)
      .sort((a: string, b: string) => a.localeCompare(b)),
  );
}
