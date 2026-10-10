// The full text of the home page as Markdown, for AI assistants that read llms.txt.
// Built from the same data files as the page, so it never says anything the page does not.
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { about } from '../data/about';
import { projects } from '../data/projects';
import { work, music, method } from '../data/home';

export const GET: APIRoute = ({ site: base }) => {
  const home = String(base);
  const lines: string[] = [
    `# ${site.fullName}`,
    '',
    `> ${site.tagline}`,
    '',
    `This is the text of the home page at ${home}, as Markdown. ${site.identity}`,
    '',
    '## About',
    '',
    ...about.flatMap((p) => [p, '']),
    '## Work',
    '',
    work.intro,
    '',
  ];
  for (const p of projects) {
    lines.push(`### ${p.title}`, '', p.kind, '', p.text, '');
    if (p.link) lines.push(`[${p.link.label}](${p.link.url})`, '');
  }
  lines.push(
    '## Music',
    '',
    music.text,
    '',
    `[Listen on Spotify](${site.spotify})${site.youtube ? ` or [watch on YouTube](${site.youtube})` : ''}.`,
    '',
    `## ${method.title}`,
    '',
    `> ${method.verse} (${method.cite})`,
    '',
    method.text,
    '',
    method.contact,
    '',
    '## Contact',
    '',
    `- Email: ${site.email}`,
    `- GitHub: ${site.github}`,
    `- Spotify: ${site.spotify}`,
    ...(site.youtube ? [`- YouTube: ${site.youtube}`] : []),
    '',
    `The brand files are at ${new URL('/brand/', base).href} and the short version of this file is at ${new URL('/llms.txt', base).href}.`,
    '',
  );
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
