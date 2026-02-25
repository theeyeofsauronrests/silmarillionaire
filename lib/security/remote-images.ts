const DEFAULT_ALLOWED_IMAGE_HOSTS = ["**.supabase.co"] as const;

function parseAdditionalHosts(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter((host) => host.length > 0);
}

function dedupeHosts(hosts: Iterable<string>): string[] {
  return Array.from(new Set(hosts));
}

export function getAllowedImageHosts(): string[] {
  const fromEnv = parseAdditionalHosts(process.env.NEXT_PUBLIC_ALLOWED_IMAGE_HOSTS);
  return dedupeHosts([...DEFAULT_ALLOWED_IMAGE_HOSTS, ...fromEnv]);
}

function hostMatchesPattern(hostname: string, pattern: string): boolean {
  if (pattern.startsWith("**.")) {
    const suffix = pattern.slice(3);
    return hostname === suffix || hostname.endsWith(`.${suffix}`);
  }

  if (pattern.startsWith("*.")) {
    const suffix = pattern.slice(2);
    return hostname === suffix || hostname.endsWith(`.${suffix}`);
  }

  return hostname === pattern;
}

export function isAllowedRemoteImageUrl(rawValue: string): { valid: true } | { valid: false; reason: string } {
  let parsed: URL;
  try {
    parsed = new URL(rawValue);
  } catch {
    return { valid: false, reason: "URL is malformed." };
  }

  if (parsed.protocol !== "https:") {
    return { valid: false, reason: "Only HTTPS image URLs are allowed." };
  }

  const hostname = parsed.hostname.toLowerCase();
  const allowed = getAllowedImageHosts().some((pattern) => hostMatchesPattern(hostname, pattern));

  if (!allowed) {
    return { valid: false, reason: `Host is not allowlisted: ${hostname}` };
  }

  return { valid: true };
}
