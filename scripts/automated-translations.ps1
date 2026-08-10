#!/usr/bin/env pwsh

# Keeps the `automated-translations` branch in sync with the given LTS branch,
# then opens (or updates) a pull request back to LTS when the branch has
# content to deliver.
#
# The translation partner (Lingoport) pushes commits directly to
# `automated-translations` with translated locale resources, and its watcher
# does a plain, non-force `git pull` from that branch. To avoid ever orphaning
# a partner commit:
#   - If the branch has commits not yet on LTS (partner translations, or a
#     previously-synced batch still pending in a PR), this script MERGES the
#     LTS branch in (preserving those commits' SHAs) and pushes WITHOUT force.
#   - Only when the branch has nothing unique to preserve does it REBASE onto
#     LTS and push with `--force-with-lease`, keeping history linear.
# See `-IsDryRun` to preview a sync without committing or pushing.

[CmdletBinding()]
param (
  [string]$LtsBranchName,
  [string]$TempPath,
  [string]$IsDryRun="false"
)

if (-not $LtsBranchName)
{
  Write-Output "`n::error::The LTS branch name is required.`n"
  exit 1
}

if (-not $TempPath -or -not (Test-Path -Path $TempPath -PathType Container))
{
  Write-Output "`n::error::The temp path is required.`n"
  exit 1
}

$IsDryRunBool = [System.Convert]::ToBoolean("$IsDryRun")

$CommitMessage = "chore: update library resources"
$GitUser = "blackbaud-sky-build-user"
$GitEmail = "sky-build-user@blackbaud.com"
$GitRepo = "blackbaud/skyux"
$GitUsername = gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /user --jq=.login
$TranslationBranchName = "automated-translations"
$WorkingCopy = "$TempPath/$TranslationBranchName"

if (Test-Path -Path $WorkingCopy -PathType Container)
{
  Write-Output "`n::error::The path $WorkingCopy already exists.`n"
  exit 1
}

# Sync the translation branch with the LTS branch
Write-Output "`n::group::Clone $LtsBranchName branch`n"
Write-Output "`n# gh repo clone $GitRepo $WorkingCopy --upstream-remote-name origin -- --branch $LtsBranchName"
gh repo clone $GitRepo $WorkingCopy --upstream-remote-name origin -- --branch $LtsBranchName
Write-Output "`n::endgroup::`n"

Set-Location -Path $WorkingCopy
Write-Output "`n# git config user.name '$GitUser'"
git config user.name "$GitUser"
Write-Output "`n# git config user.email '$GitEmail'"
git config user.email "$GitEmail"
Write-Output "`n# git remote set-url origin 'https://${GitUsername}:********@github.com/${GitRepo}.git'"
git remote set-url origin "https://${GitUsername}:${env:GH_TOKEN}@github.com/${GitRepo}.git"
$remoteBranchExists = git ls-remote -b origin $TranslationBranchName

if (-not $remoteBranchExists)
{
  Write-Output "`n::group::Create new $TranslationBranchName branch`n"
  Write-Output "`n# git checkout -B $TranslationBranchName $LtsBranchName"
  git checkout -B $TranslationBranchName $LtsBranchName

  if (-not $IsDryRunBool)
  {
    Write-Output "`n➡︎ The $TranslationBranchName branch does not exist. Creating the branch.`n"
    Write-Output "`n# git push origin $TranslationBranchName"
    git push origin $TranslationBranchName
  }
  Write-Output "`n::endgroup::`n"
  if ($env:GITHUB_OUTPUT)
  {
    Write-Output "success=true" >> $env:GITHUB_OUTPUT
  }
}
else
{
  Write-Output "`n::group::Update $TranslationBranchName branch from $LtsBranchName branch`n"
  Write-Output "`n# git checkout -B $TranslationBranchName origin/$TranslationBranchName"
  git checkout -B $TranslationBranchName origin/$TranslationBranchName
  Write-Output "`n# git pull"
  git pull --set-upstream origin $TranslationBranchName

  $existingPr = gh pr list --state open --base $LtsBranchName --head $TranslationBranchName --limit 100 `
    --json title,url,headRefName,baseRefName `
    --jq ".[] | select(.headRefName == `"${TranslationBranchName}`" and .baseRefName == `"${LtsBranchName}`")"
  if ($LASTEXITCODE -ne 0)
  {
    Write-Output "`n::error::gh pr list failed (exit $LASTEXITCODE).`n"
    exit $LASTEXITCODE
  }

  # Commits on this branch that are not yet on the LTS branch (e.g. translations
  # pushed directly by the translation partner) must never be rewritten or
  # force-pushed away, whether or not a pull request already exists for them.
  $aheadCount = [int](git rev-list --count "$LtsBranchName..HEAD")
  Write-Output "`n# git rev-list --count $LtsBranchName..HEAD"
  Write-Output "$aheadCount"

  if ($aheadCount -gt 0)
  {
    Write-Output "`n# git merge --no-edit $LtsBranchName   ($aheadCount commit(s) ahead of $LtsBranchName — preserving them)"
    git merge --no-edit $LtsBranchName
    if ($LASTEXITCODE -ne 0)
    {
      Write-Output "`n::error::git merge failed (exit $LASTEXITCODE). Resolve conflicts manually so translation changes are not discarded.`n"
      exit $LASTEXITCODE
    }
    $historyRewritten = $false
  }
  else
  {
    Write-Output "`n# git rebase $LtsBranchName"
    git rebase $LtsBranchName
    if ($LASTEXITCODE -ne 0)
    {
      Write-Output "`n::error::git rebase failed (exit $LASTEXITCODE).`n"
      exit $LASTEXITCODE
    }
    $historyRewritten = $true
  }
  Write-Output "`n::endgroup::`n"

  Write-Output "`n::group::NPM Install`n"
  Write-Output "`n# npm ci"
  npm ci --no-audit --no-progress --no-fund
  if ($LASTEXITCODE -ne 0)
  {
    Write-Output "`n::error::npm ci failed (exit $LASTEXITCODE).`n"
    exit $LASTEXITCODE
  }
  Write-Output "`n::endgroup::`n"

  Write-Output "`n::group::Update library resources`n"
  Write-Output "`n# npm run dev:create-library-resources"
  npm run dev:create-library-resources
  if ($LASTEXITCODE -ne 0)
  {
    Write-Output "`n::error::dev:create-library-resources failed (exit $LASTEXITCODE).`n"
    exit $LASTEXITCODE
  }
  Write-Output "`n::endgroup::`n"

  Write-Output "`n::group::Prettier`n"
  Write-Output "`n# npx nx format:write"
  npx nx format:write
  if ($LASTEXITCODE -ne 0)
  {
    Write-Output "`n::error::nx format:write failed (exit $LASTEXITCODE).`n"
    exit $LASTEXITCODE
  }
  Write-Output "`n::endgroup::`n"

  Write-Output "`n::group::Check for changes`n"
  Write-Output "`n# git add -- '**/src/assets/locales/*.json' '**/*-resources.module.ts'"
  git add -- '**/src/assets/locales/*.json' '**/*-resources.module.ts'
  Write-Output "`n# git diff --cached --stat"
  git diff --cached --stat
  Write-Output "#"

  # Only the staged locale/resource-module paths count as "changes" — anything
  # else touched by npm ci or nx format:write (e.g. lockfile drift) is left
  # unstaged and untouched, so it can never be committed here.
  $changes = git diff --cached --name-only

  if ($changes)
  {
    if ($IsDryRunBool)
    {
      Write-Output "`nChanges detected. Run the script without the -IsDryRun flag to commit the changes.`n"
    }
    else
    {
      Write-Output "`n::endgroup::`n"

      Write-Output "`n::group::Push changes to $TranslationBranchName branch`n"
      Write-Output "`n# git commit -m '${CommitMessage}'"
      git commit -m "${CommitMessage}"
    }
  }
  else
  {
    Write-Output "`n➡︎ No changes detected.`n"
  }

  if (-not $IsDryRunBool)
  {
    if ($historyRewritten)
    {
      Write-Output "`n# git push --force-with-lease origin $TranslationBranchName"
      git push --force-with-lease origin $TranslationBranchName
    }
    else
    {
      Write-Output "`n# git push origin $TranslationBranchName"
      git push origin $TranslationBranchName
    }
    if ($LASTEXITCODE -ne 0)
    {
      Write-Output "`n::error::git push failed (exit $LASTEXITCODE).`n"
      exit $LASTEXITCODE
    }
  }
  else
  {
    Write-Output "`nDry run complete. Run the script without the -IsDryRun flag to push the changes.`n"
  }
  Write-Output "`n::endgroup::`n"

  $changesFromLts = git diff $LtsBranchName --name-only
  if ($changesFromLts)
  {
    Write-Output "`n::group::Pull request`n"
    $prForChanges = $existingPr
    if ($prForChanges)
    {
      if ($env:GITHUB_OUTPUT)
      {
        Write-Output "prCreated=false" >> $env:GITHUB_OUTPUT
      }
    }
    else
    {
      Write-Output "`n➡︎ Creating a pull request for changes"
      Write-Output "`n# gh pr create --base $LtsBranchName --head $TranslationBranchName --title '${CommitMessage}'"
      gh pr create --base $LtsBranchName --head $TranslationBranchName `
        --title "${CommitMessage}" `
        --body ":robot: This pull request was created by the automated translations script." `
        --label "risk level (author): 1" `
        --label "skip e2e"
      if ($LASTEXITCODE -ne 0)
      {
        Write-Output "`n::error::gh pr create failed (exit $LASTEXITCODE).`n"
        exit $LASTEXITCODE
      }
      $prForChanges = gh pr list --state open --base $LtsBranchName --head $TranslationBranchName --limit 100 `
        --json title,url,headRefName,baseRefName `
        --jq ".[] | select(.headRefName == `"${TranslationBranchName}`" and .baseRefName == `"${LtsBranchName}`")"
      if ($LASTEXITCODE -ne 0)
      {
        Write-Output "`n::error::gh pr list failed (exit $LASTEXITCODE).`n"
        exit $LASTEXITCODE
      }
      if ($env:GITHUB_OUTPUT)
      {
        Write-Output "prCreated=true" >> $env:GITHUB_OUTPUT
      }
    }
    $pr = $prForChanges | ConvertFrom-Json
    Write-Output "`n➡︎ Pull request for changes:`n  $($pr.title)`n  $($pr.url)`n"
    if ($env:GITHUB_OUTPUT)
    {
      Write-Output "prTitle=$($pr.title)" >> $env:GITHUB_OUTPUT
      Write-Output "prUrl=$($pr.url)" >> $env:GITHUB_OUTPUT
      if ($pr.url)
      {
        Write-Output "success=true" >> $env:GITHUB_OUTPUT
      }
    }
    Write-Output "`n::endgroup::`n"
  }
  else
  {
    Write-Output "`n::group::No pull request`n"
    Write-Output "`n➡︎ No changes to merge to $LtsBranchName branch from $TranslationBranchName branch.`n"
    Write-Output "`n::endgroup::`n"
    if ($env:GITHUB_OUTPUT)
    {
      Write-Output "success=true" >> $env:GITHUB_OUTPUT
    }
  }
}
