export async function onRequest({ request, env }) {
  fetch(`https://api.geocod.io/v1.9/geocode?q=${encodeURIComponent(formattedAddress)}&api_key=${env.GEOCODIO_API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const results = data.results;
      if (results.length) {
        const { lat, lng } = results[0].location;
        console.log(`${lat}, ${lng}`);
      } else {
        console.log('No location results found');
      }
    })
    .catch(error => console.error(error));
  return new Response(JSON.stringify({ secretUsed: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}