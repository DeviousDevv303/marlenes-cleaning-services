#!/usr/bin/env node

const owner = process.env.GITHUB_OWNER || 'DeviousDevv303';
const repo = process.env.GITHUB_REPO || 'marlenes-cleaning-services';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const branch = process.env.GITHUB_PAGES_BRANCH || 'gh-pages';
const path = process.env.GITHUB_PAGES_PATH || '/';

if (!token) {
  console.error('Missing token. Set GITHUB_TOKEN or GH_TOKEN to a fine-grained token with Administration: Read and write for this repository.');
  process.exit(1);
}

const apiBase = 'https://api.github.com';
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
  'User-Agent': 'marlenes-cleaning-services-pages-enabler',
};

async function request(method, endpoint, body) {
  const response = await fetch(`${apiBase}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { response, data };
}

async function main() {
  const payload = {
    source: {
      branch,
      path,
    },
  };

  let result = await request('GET', `/repos/${owner}/${repo}/pages`);
  if (result.response.status === 404) {
    console.log('GitHub Pages is not enabled yet. Creating Pages site...');
    result = await request('POST', `/repos/${owner}/${repo}/pages`, payload);
  } else if (result.response.ok) {
    console.log('GitHub Pages already exists. Updating Pages source...');
    result = await request('PUT', `/repos/${owner}/${repo}/pages`, payload);
  }

  if (!result.response.ok) {
    console.error(`GitHub Pages enable/update failed: HTTP ${result.response.status}`);
    console.error(typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2));
    process.exit(1);
  }

  const status = await request('GET', `/repos/${owner}/${repo}/pages`);
  if (!status.response.ok) {
    console.error(`Pages status check failed: HTTP ${status.response.status}`);
    console.error(typeof status.data === 'string' ? status.data : JSON.stringify(status.data, null, 2));
    process.exit(1);
  }

  console.log('GitHub Pages configured successfully.');
  console.log(JSON.stringify({
    url: status.data?.html_url || `https://${owner.toLowerCase()}.github.io/${repo}/`,
    status: status.data?.status,
    source: status.data?.source,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
