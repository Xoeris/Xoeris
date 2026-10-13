/**
 * Smart GitHub Release Asset Resolver
 * Fetches latest release assets from GitHub API and matches the user's OS / Architecture.
 */

// Helper to determine the client platform
export function detectClientPlatform() {
  if (typeof window === 'undefined' || !window.navigator) {
    return { os: 'windows', arch: 'x64', label: 'Windows (x64)' };
  }

  const ua = (window.navigator.userAgent || '').toLowerCase();
  const platform = (window.navigator.platform || '').toLowerCase();

  // Detect architecture if possible
  const isArm = ua.includes('arm') || ua.includes('aarch64') || platform.includes('arm');
  const is64 = ua.includes('x64') || ua.includes('win64') || ua.includes('x86_64') || ua.includes('amd64') || !ua.includes('x86');
  const arch = isArm ? 'arm64' : (is64 ? 'x64' : 'x86');

  // Detect OS
  if (ua.includes('android')) {
    return { os: 'android', arch, label: 'Android' };
  }
  if (ua.includes('win')) {
    return { os: 'windows', arch, label: `Windows (${arch})` };
  }
  if (ua.includes('mac') || platform.includes('mac') || ua.includes('darwin')) {
    return { os: 'mac', arch, label: `macOS (${arch})` };
  }
  if (ua.includes('linux')) {
    return { os: 'linux', arch, label: `Linux (${arch})` };
  }

  return { os: 'windows', arch: 'x64', label: 'Windows (x64)' };
}

/**
 * Fetch latest release assets for a given repository (e.g. "Xoeris/Horizone-IDE")
 * Returns release metadata, tag_name, assets, and matches for each platform.
 */
export async function fetchLatestRelease(repo) {
  try {
    // We try /releases/latest first, and fall back to /releases list in case of pre-releases
    let res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: 'application/vnd.github.v3+json' }
    });

    if (!res.ok) {
      // Fallback for repos where the release is tagged as pre-release / alpha
      const listRes = await fetch(`https://api.github.com/repos/${repo}/releases`, {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        if (Array.isArray(listData) && listData.length > 0) {
          return parseReleaseData(listData[0]);
        }
      }
      return null;
    }

    const data = await res.json();
    return parseReleaseData(data);
  } catch (err) {
    console.warn(`[GitHub Release Resolver] Error fetching release for ${repo}:`, err);
    return null;
  }
}

function parseReleaseData(release) {
  const assets = (release.assets || []).map(asset => ({
    name: asset.name,
    size: asset.size,
    downloadCount: asset.download_count,
    url: asset.browser_download_url,
    createdAt: asset.created_at
  }));

  return {
    tagName: release.tag_name,
    releaseName: release.name || release.tag_name,
    publishedAt: release.published_at,
    htmlUrl: release.html_url,
    assets
  };
}

/**
 * Smart Asset Matcher: Matches user's platform against release assets.
 * Supports Windows (.exe, .zip), macOS (.dmg, .tar.gz), Linux (.tar.gz, .deb, AppImage), Android (.apk).
 */
export function matchBestAsset(assets, platformInfo) {
  if (!assets || assets.length === 0) return null;

  const { os, arch } = platformInfo;

  if (os === 'android') {
    // Match .apk
    const apk = assets.find(a => a.name.toLowerCase().endsWith('.apk'));
    if (apk) return apk;
  }

  if (os === 'windows') {
    // Look for win + specific arch exe/zip
    const winSpecific = assets.find(a => {
      const n = a.name.toLowerCase();
      return (n.includes('win') || n.endsWith('.exe')) && n.includes(arch);
    });
    if (winSpecific) return winSpecific;

    // Fall back to any win asset
    const anyWin = assets.find(a => {
      const n = a.name.toLowerCase();
      return n.includes('win') || n.endsWith('.exe');
    });
    if (anyWin) return anyWin;
  }

  if (os === 'mac') {
    // Look for osx / mac / darwin + arch
    const macSpecific = assets.find(a => {
      const n = a.name.toLowerCase();
      return (n.includes('osx') || n.includes('mac') || n.includes('darwin')) && n.includes(arch);
    });
    if (macSpecific) return macSpecific;

    const anyMac = assets.find(a => {
      const n = a.name.toLowerCase();
      return n.includes('osx') || n.includes('mac') || n.includes('darwin') || n.endsWith('.dmg');
    });
    if (anyMac) return anyMac;
  }

  if (os === 'linux') {
    // Look for linux + arch
    const linuxSpecific = assets.find(a => {
      const n = a.name.toLowerCase();
      return n.includes('linux') && n.includes(arch);
    });
    if (linuxSpecific) return linuxSpecific;

    const anyLinux = assets.find(a => {
      const n = a.name.toLowerCase();
      return n.includes('linux') || n.endsWith('.deb') || n.endsWith('.appimage');
    });
    if (anyLinux) return anyLinux;
  }

  // Fallback to first available asset
  return assets[0];
}
