export async function onRequestGet(context) {
  const secretValue = context.env.GEOCODIO_API_KEY;
  console.log(secretValue);
  return new Response(JSON.stringify('chicken butt'), {
     headers: { 'Content-Type': 'application/json' },
    });
}