# Git Operations Plan

This plan outlines the steps to be executed by Code mode to manage git branches as requested.

## Steps

1.  **Switch to `main` branch**
    *   Command: `git checkout main`

2.  **Check for uncommitted changes**
    *   Command: `git status`
    *   *Decision Point*:
        *   If `git status` indicates "nothing to commit, working tree clean", proceed to step 3.
        *   If there are uncommitted changes, execute:
            *   `git stash push -m "Auto-stash before switching to feat/update-vite-config"`

3.  **Create and switch to `feat/update-vite-config`**
    *   Command: `git checkout -b feat/update-vite-config`

## Verification
*   After step 3, run `git branch --show-current` to confirm the active branch is `feat/update-vite-config`.
