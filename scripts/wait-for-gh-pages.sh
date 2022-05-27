#!/usr/bin/env bash

set -eo pipefail

REPO=$1
if [[ -z "${REPO}" ]]
then
  echo "Usage: $0 OWNER/REPO"
  exit 1
fi

LATEST_COMMIT=$(gh api -H "Accept: application/vnd.github.v3+json" "/repos/${REPO}/commits?per_page=1" --jq '.[] | .sha')

if [[ -z "${LATEST_COMMIT}" ]]
then
  echo "Unable to determine latest commit."
  exit 0
fi

for i in {1..5}
do
  sleep $(( i * 2))
  CURRENT_BUILD=$(gh api -H "Accept: application/vnd.github.v3+json" "/repos/${REPO}/pages/builds" --jq ".[] | select(.commit == \"${LATEST_COMMIT}\") | .commit")
  if [[ "${CURRENT_BUILD}" == "${LATEST_COMMIT}" ]]
  then
    echo "OK"
    exit 0
  fi
done

echo "GitHub Pages for ${REPO} does not seem to have updated within 30 seconds."
exit 0
