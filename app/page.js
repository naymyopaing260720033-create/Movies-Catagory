import { supabasePublic } from '../lib/supabaseClient';

export const revalidate = 0; // always fetch fresh data, no caching

export default async function Home() {
  const { data: movies, error } = await supabasePublic
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="container">
      <h1>🎬 Movie Catalog</h1>

      {error && <p className="error">Error loading movies: {error.message}</p>}

      {!error && (!movies || movies.length === 0) && (
        <p className="empty">No movies yet. Post something in the Telegram channel!</p>
      )}

      <div className="grid">
        {movies?.map((m) => (
          <a
            key={m.id}
            href={m.telegram_link}
            target="_blank"
            rel="noopener noreferrer"
            className="card"
          >
            {m.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                alt={m.title}
                loading="lazy"
              />
            ) : (
              <div className="no-poster">No Poster</div>
            )}
            <div className="info">
              <h3>{m.title}</h3>
              {m.release_date && <p className="year">{m.release_date.slice(0, 4)}</p>}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
