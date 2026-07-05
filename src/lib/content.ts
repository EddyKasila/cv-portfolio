import fs from 'node:fs';
import path from 'node:path';
import type { ContentMap, ContentType } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

export class ContentService {
  /**
   * Load content at build time (SSG). Uses fs to read from public/data/.
   * Call this in Astro frontmatter: const profile = ContentService.getSync('profile');
   */
  static getSync<T = ContentMap[ContentType]>(type: ContentType): T {
    const filePath = path.join(DATA_DIR, `${type}.json`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  }

  /**
   * Load content at runtime (client-side). Uses fetch to get JSON from the public directory.
   * Call this in client-side scripts: const profile = await ContentService.get('profile');
   */
  static async get<T = ContentMap[ContentType]>(type: ContentType): Promise<T> {
    const base = typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL : '/';
    const normalizedBase = base.endsWith('/') ? base : base + '/';
    const url = `${normalizedBase}data/${type}.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${type}.json: ${res.status}`);
    return res.json() as Promise<T>;
  }

  /**
   * Load all content types at once (build time).
   */
  static getAllSync(): ContentMap {
    const types: ContentType[] = ['profile', 'experience', 'projects', 'education', 'skills', 'certifications', 'articles', 'contact'];
    const result = {} as ContentMap;
    for (const type of types) {
      result[type] = this.getSync(type);
    }
    return result;
  }

  /**
   * Load all content types at once (runtime).
   */
  static async getAll(): Promise<ContentMap> {
    const types: ContentType[] = ['profile', 'experience', 'projects', 'education', 'skills', 'certifications', 'articles', 'contact'];
    const entries = await Promise.all(types.map(t => this.get(t).then(d => [t, d] as const)));
    return Object.fromEntries(entries) as ContentMap;
  }

  /**
   * Export content as a downloadable JSON file.
   */
  static exportToFile(type: ContentType, data: unknown): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Build a GitHub API commit URL for the given content type.
   */
  static getGithubCommitUrl(type: ContentType): string {
    const repo = 'EddyKasila/cv-portfolio';
    const branch = 'master';
    const path = `public/data/${type}.json`;
    return `https://github.com/${repo}/blob/${branch}/${path}`;
  }
}
