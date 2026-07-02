export function asset(path: string): string {
    const base = import.meta.env.BASE_URL;
    const normalizedBase = base.endsWith('/') ? base : base + '/';
    return normalizedBase + (path.startsWith('/') ? path.slice(1) : path);
}
