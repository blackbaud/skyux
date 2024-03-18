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
  return async (url: string, name: string) =>
    fetchClient(url)
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
}

export async function checkPercyBuild(
  project: string,
  commitSha: string,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch,
): Promise<BuildSummary> {
  const fetchJson = getFetchJson(fetchClient);
  try {
    const projectId = await getProjectId(project, fetchJson);
    const build = await getBuilds(
      projectId,
      [commitSha],
      [],
      100,
      fetchJson,
    ).then((builds) => builds.pop());
    if (build?.id) {
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
      return {
        project,
        state: undefined,
        approved: false,
        removedSnapshots: [],
      };
    }
  } catch (error) {
    return Promise.reject(
      new Error(`Error checking Percy build: ${error}`, {
        cause: error,
      }),
    );
  }
}

export async function getLastGoodPercyBuild(
  project: string,
  shaArray: string[],
  allowDeletedScreenshots: boolean,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch,
): Promise<string> {
  const fetchJson = getFetchJson(fetchClient);
  try {
    const projectId = await getProjectId(project, fetchJson);
    const builds = await getBuilds(
      projectId,
      shaArray,
      ['finished'],
      100,
      fetchJson,
    );
    const lastApprovedBuild = builds.find(
      (build) => build.attributes['review-state'] === 'approved',
    );
    if (!allowDeletedScreenshots && lastApprovedBuild?.id) {
      const removedSnapshots = await getRemovedSnapshots(
        lastApprovedBuild.id,
        fetchJson,
      );
      if (removedSnapshots.length > 0) {
        // Force the build to re-run.
        return '';
      }
    }
    return lastApprovedBuild
      ? (lastApprovedBuild.attributes['commit-html-url']
          .split('/')
          .pop() as string)
      : '';
  } catch (error) {
    throw new Error(`Error checking Percy: ${error}`, {
      cause: error,
    });
  }
}

export async function getPercyTargetCommit(
  project: string,
  shaArray: string[],
  /* istanbul ignore next */
  fetchClient: Fetch = fetch,
): Promise<string> {
  const fetchJson = getFetchJson(fetchClient);

  function chunk(shaArray: string[], number: number) {
    const result = [];
    for (let i = 0; i < shaArray.length; i += number) {
      result.push(shaArray.slice(i, i + number));
    }
    return result;
  }

  const shaArrayBatchesOf25 = chunk(shaArray, 25);
  try {
    const projectId = await getProjectId(project, fetchJson);
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
    throw new Error(`Error checking Percy: ${error}`, {
      cause: error,
    });
  }
}

async function getProjectId(
  slug: string,
  fetchJson: FetchJson,
): Promise<string> {
  return fetchJson<{ id: string }>(
    `https://percy.io/api/v1/projects?project_slug=${slug}`,
    'Percy project ID',
  ).then((response) => {
    if (response.id) {
      return response.id;
    } else {
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
  return fetchJson<Build[]>(
    `https://percy.io/api/v1/builds?project_id=${projectId}${shaFilter}${stateFilter}&page[limit]=${limit}`,
    'Percy builds',
  ).then((builds) => builds.filter((build) => build.type === 'builds'));
}

async function getRemovedSnapshots(
  buildId: string,
  fetchJson: FetchJson,
): Promise<string[]> {
  return fetchJson<Snapshot[]>(
    `https://percy.io/api/v1/builds/${buildId}/removed-snapshots`,
    'removed snapshots',
  ).then((response) =>
    response
      .filter((snapshot) => snapshot.type === 'snapshots')
      .map((snapshot: Snapshot) => snapshot.attributes.name)
      .sort((a: string, b: string) => a.localeCompare(b)),
  );
}
