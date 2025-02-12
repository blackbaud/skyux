#!/usr/bin/env pwsh

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
$GitUser = "user.name=blackbaud-sky-build-user"
$GitEmail = "user.email=sky-build-user@blackbaud.com"
$GitRepo = "blackbaud/skyux"
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
}
else
{
  Write-Output "`n::group::Update $TranslationBranchName branch from $LtsBranchName branch`n"
  Write-Output "`n# git checkout -B $TranslationBranchName origin/$TranslationBranchName"
  git checkout -B $TranslationBranchName origin/$TranslationBranchName
  Write-Output "`n# git pull"
  git pull --set-upstream origin $TranslationBranchName

  if ($IsDryRunBool)
  {
    Write-Output "`n# git merge -X theirs --no-commit $LtsBranchName"
    git merge -X theirs --no-commit $LtsBranchName
  }
  else
  {
    Write-Output "`n# git merge -X theirs $LtsBranchName"
    git -c "$GitUser" -c "$GitEmail" merge -X theirs $LtsBranchName
  }
  Write-Output "`n::endgroup::`n"

  Write-Output "`n::group::NPM Install`n"
  Write-Output "`n# npm ci"
  npm ci --no-audit --no-progress --no-fund
  Write-Output "`n::endgroup::`n"

  Write-Output "`n::group::Update library resources`n"
  Write-Output "`n# npm run dev:create-library-resources"
  npm run dev:create-library-resources
  Write-Output "`n::endgroup::`n"

  Write-Output "`n::group::Prettier`n"
  Write-Output "`n# npx nx format:write"
  npx nx format:write
  Write-Output "`n::endgroup::`n"

  Write-Output "`n::group::Check for changes`n"
  Write-Output "`n# git status"
  git status
  Write-Output "#"

  $changes = git status --porcelain

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
      Write-Output "`n# git commit -am '${CommitMessage}'"
      git add -A
      git -c "$GitUser" -c "$GitEmail" commit -m "${CommitMessage}"
    }
  }
  else
  {
    Write-Output "`n➡︎ No changes detected.`n"
  }

  if (-not $IsDryRunBool)
  {
    Write-Output "`n# git push origin $TranslationBranchName"
    git push origin $TranslationBranchName
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
    $prForChanges = gh pr list --json title,url,headRefName --jq ".[] | select(.headRefName == `"${LtsBranchName}`")"
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
      Write-Output "`n# gh pr create --base $TranslationBranchName --head $LtsBranchName --title '${CommitMessage}'"
      gh pr create --base $TranslationBranchName --head $LtsBranchName --title "${CommitMessage}"
      $prForChanges = gh pr list --json title,url,headRefName --jq ".[] | select(.headRefName == `"${LtsBranchName}`")"
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
    }
    Write-Output "`n::endgroup::`n"
  }
  else
  {
    Write-Output "`n::group::No pull request`n"
    Write-Output "`n➡︎ No changes to merge to $LtsBranchName branch from $TranslationBranchName branch.`n"
    Write-Output "`n::endgroup::`n"
  }
}
