export function StarField() {
  return <div className="atmosphere" aria-hidden="true"><div className="nebula nebula-one" /><div className="nebula nebula-two" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="star-field">{Array.from({ length: 70 }, (_, i) => <i key={i} style={{ left: `${(i * 47.31 + 5) % 100}%`, top: `${(i * 31.73 + 3) % 100}%`, width: i % 9 === 0 ? 3 : 1.5, height: i % 9 === 0 ? 3 : 1.5, animationDelay: `${i % 7}s`, animationDuration: `${4 + i % 5}s`, opacity: .2 + (i % 5) * .12 }} />)}</div><div className="shooting-star" /></div>;
}
export function StarGlyph({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 2 39 24 62 32 39 39 32 62 24 39 2 32 24 24Z" fill="currentColor" /><path d="m32 13 4.6 14.4L51 32l-14.4 4.6L32 51l-4.6-14.4L13 32l14.4-4.6Z" fill="white" fillOpacity=".65" /></svg>;
}
