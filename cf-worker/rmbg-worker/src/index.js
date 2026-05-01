export default {
  async fetch(request, env) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      // Get image from request body
      const formData = await request.formData()
      const imageFile = formData.get('image')

      if (!imageFile) {
        return new Response(JSON.stringify({ error: 'No image provided' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        })
      }

      const imageBuffer = await imageFile.arrayBuffer()
      const imageArray = new Uint8Array(imageBuffer)

      // Run RMBG-1.4 via Cloudflare AI
      const result = await env.AI.run('@cf/bria/rmbg-1.4', {
        image: Array.from(imageArray),
      })

      // result is the PNG image with transparent background
      return new Response(result, {
        headers: {
          'Content-Type': 'image/png',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
        },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }
  },
}
