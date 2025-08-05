export async function onRequest({ request, env }) {
  const address = await request.json();
  fetch(`https://api.geocod.io/v1.9/geocode?q=${encodeURIComponent(address)}&api_key=${env.GEOCODIO_API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const results = data.results;
      if (results.length) {
        const { lat, lng } = results[0].location;
        return new Response(JSON.stringify({ lat, lng }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        console.log('No location results found');
      }
    })
    .catch(error => console.error(error));
}