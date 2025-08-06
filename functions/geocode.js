export async function onRequest(context) {
  const { request, env } = context;

  const body = await request.json();
  const address = body.formattedAddress;

  const url = `https://api.geocod.io/v1.9/geocode?q=${encodeURIComponent(address)}&api_key=${env.GEOCODIO_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const results = data.results;
  if (results.length) {
    const { lat, lng } = results[0].location;
    return new Response(JSON.stringify(
    {
        latitude : lat,
        longitude : lng
    }
    ), {
        headers: { 'Content-Type': 'application/json' },
    });
} else {
    console.log('No location results found');
  }
}