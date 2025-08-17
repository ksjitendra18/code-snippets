export function generateNewVersion(currentVersion: string, type: string) {
  const versionParts = currentVersion.split(".").map((part) => parseInt(part));

  if (versionParts.length !== 3 || versionParts.some(isNaN)) {
    throw new Error(
      'Invalid version format. Expected format: major.minor.patch (e.g., "1.2.3")'
    );
  }

  let [major, minor, patch] = versionParts;

  switch (type.toLowerCase()) {
    case "major":
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case "minor":
      minor += 1;
      patch = 0;
      break;
    case "patch":
      patch += 1;
      break;
    default:
      throw new Error('Invalid version type. Use "major", "minor", or "patch"');
  }

  return `${major}.${minor}.${patch}`;
}

function getNextVersions(currentVersion: string) {
  const versionParts = currentVersion.split(".").map((part) => parseInt(part));

  if (versionParts.length !== 3 || versionParts.some(isNaN)) {
    throw new Error(
      'Invalid version format. Expected format: major.minor.patch (e.g., "1.2.3")'
    );
  }

  let [major, minor, patch] = versionParts;

  return {
    current: currentVersion,
    major: `${major + 1}.0.0`,
    minor: `${major}.${minor + 1}.0`,
    patch: `${major}.${minor}.${patch + 1}`,
  };
}
