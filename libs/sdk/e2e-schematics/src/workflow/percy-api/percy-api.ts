type Build = {
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
};

export type Fetch = (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response>;

type FetchJson = <T extends object>(url: string, name: string) => Promise<T>;

type Snapshot = {
  type: 'snapshots';
  id: string;
  attributes: {
    name: string;
  };
};

function getFetchJson(
  fetchClient: (
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<Response>,
  options: object
): FetchJson {
  return async (url: string, name: string) =>
    fetchClient(url, options)
      .then((res) => res.json())
      .then((res) => res.data)
      .catch((error) => {
        throw new Error(`Error fetching ${name}: ${error}`, { cause: error });
      });
}

export async function checkPercyBuild(
  project: string,
  commitSha: string,
  options: object,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch
): Promise<{
  project: string;
  approved: boolean;
  removedSnapshots: string[];
}> {
  const fetchJson = getFetchJson(fetchClient, options);
  try {
    const projectId = await getProjectId(project, fetchJson);
    const build = await getBuilds(projectId, [commitSha], fetchJson).then(
      (builds) => builds.pop()
    );
    if (build?.id) {
      const approved = build.attributes['review-state'] === 'approved';
      const removedSnapshots = await getRemovedSnapshots(build.id, fetchJson);
      return {
        project,
        approved,
        removedSnapshots,
      };
    } else {
      return {
        project,
        approved: false,
        removedSnapshots: [],
      };
    }
  } catch (error) {
    throw new Error(`Error checking Percy build: ${error}`, {
      cause: error,
    });
  }
}

export async function getLastGoodPercyBuild(
  project: string,
  shaArray: string[],
  options: object,
  /* istanbul ignore next */
  fetchClient: Fetch = fetch
): Promise<string> {
  const fetchJson = getFetchJson(fetchClient, options);
  try {
    const projectId = await getProjectId(project, fetchJson);
    const builds = await getBuilds(projectId, shaArray, fetchJson);
    const lastApprovedBuild = builds.find(
      (build) => build.attributes['review-state'] === 'approved'
    );
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

async function getProjectId(
  slug: string,
  fetchJson: FetchJson
): Promise<string> {
  return fetchJson<{ id: string }>(
    `https://percy.io/api/v1/projects?project_slug=${slug}`,
    'Percy project ID'
  ).then((response) => response.id);
}

async function getBuilds(
  projectId: string,
  shas: string[],
  fetchJson: FetchJson
): Promise<Build[]> {
  const shaFilter = shas.map((sha) => `&filter[shas][]=${sha}`).join('');
  return fetchJson<Build[]>(
    `https://percy.io/api/v1/builds?project_id=${projectId}${shaFilter}&filter[state]=finished&page[limit]=100`,
    'Percy builds'
  ).then((builds) => builds.filter((build) => build.type === 'builds'));
}

async function getRemovedSnapshots(
  buildId: string,
  fetchJson: FetchJson
): Promise<string[]> {
  return fetchJson<Snapshot[]>(
    `https://percy.io/api/v1/builds/${buildId}/removed-snapshots`,
    'removed snapshots'
  ).then((response) =>
    response
      .filter((snapshot: any) => snapshot.type === 'snapshots')
      .map((snapshot: Snapshot) => snapshot.attributes.name)
      .sort((a: string, b: string) => a.localeCompare(b))
  );
}
