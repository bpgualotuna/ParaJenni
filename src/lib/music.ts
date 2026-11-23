/** Resolve official music links only. Returned URLs are rebuilt, never interpolated from arbitrary origins. */
export function getMusicEmbed(raw: string): { embed: string; original: string; platform: string } | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return null;
    if (url.hostname === 'open.spotify.com') {
      const match = url.pathname.match(/^\/(?:intl-[a-z]+\/)?track\/([A-Za-z0-9]{22})\/?$/);
      if (match) return { embed: `https://open.spotify.com/embed/track/${match[1]}`, original: `https://open.spotify.com/track/${match[1]}`, platform: 'Spotify' };
    }
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be'].includes(url.hostname)) {
      const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1];
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return { embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`, original: `https://www.youtube.com/watch?v=${id}`, platform: 'YouTube' };
    }
  } catch { /* An unfinished link is an expected content state. */ }
  return null;
}
