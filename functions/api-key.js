export async function onRequest({ request, env }) {
  // Use secret here safely
  const secret = env.GEOCODIO_API_KEY;

  // Your logic here
  return new Response(JSON.stringify({ secretUsed: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}