const CAST = [
  { src: '/characters/spongebob.jpg', name: 'SpongeBob' },
  { src: '/characters/patrick.jpg', name: 'Patrick' },
  { src: '/characters/squidward.jpg', name: 'Squidward' },
  { src: '/characters/sandy.jpg', name: 'Sandy' },
  { src: '/characters/krabs.jpg', name: 'Mr. Krabs' },
  { src: '/characters/pirate.jpg', name: 'Pirate' },
];

export function Cast({ compact = false }) {
  return (
    <div className={compact ? 'cast compact' : 'cast'}>
      {CAST.map((c) => (
        <figure key={c.name}>
          <img src={c.src} alt={c.name} />
          {!compact && <figcaption>{c.name}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
