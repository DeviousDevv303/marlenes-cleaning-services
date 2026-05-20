# Permanent GitHub Pages Deployment Handoff

This project is prepared for permanent GitHub Pages hosting. The static production build has already been pushed to the repository’s `gh-pages` branch. The remaining blocker is enabling GitHub Pages in repository settings, which requires a token with repository administration access.

## Permanent Website URL

Once GitHub Pages is enabled, the permanent website should resolve at:

```text
https://deviousdevv303.github.io/marlenes-cleaning-services/
```

## Current Deployment State

| Item | Status |
|---|---|
| Static GitHub Pages build | Complete |
| `gh-pages` branch | Present |
| Vite base path for repo Pages | Configured |
| Scheduling form static fallback | Configured |
| Reviews static fallback | Configured |
| HTML title and SEO metadata | Updated |
| GitHub Pages repository setting | Blocked until admin/pages token is available |

## Required Token Permission

Use a short-lived fine-grained GitHub token for `DeviousDevv303/marlenes-cleaning-services` with:

| Permission | Access |
|---|---|
| Administration | Read and write |
| Contents | Read and write |
| Metadata | Read-only, automatically included |

The existing token in the current environment can push repository contents but cannot enable Pages or edit repository settings.

## Enable Pages from Script

After exporting a token with the required permission, run:

```bash
cd /home/ubuntu/marlenes-cleaning-services
GITHUB_TOKEN='paste_token_here' node scripts/enable-github-pages.mjs
```

The script calls GitHub’s Pages API and sets:

| Setting | Value |
|---|---|
| Source | Deploy from a branch |
| Branch | `gh-pages` |
| Folder | `/ (root)` |

## Manual Fallback

If using the GitHub web UI instead, open:

```text
https://github.com/DeviousDevv303/marlenes-cleaning-services/settings/pages
```

Then set:

```text
Source: Deploy from a branch
Branch: gh-pages
Folder: / (root)
```

After saving, wait one to three minutes and verify:

```bash
curl -I -L https://deviousdevv303.github.io/marlenes-cleaning-services/
```

A successful permanent deployment should return an HTTP 200 response.
