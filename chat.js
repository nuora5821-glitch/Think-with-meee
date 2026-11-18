exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '' };
  try {
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt || prompt.length > 6000) return { statusCode: 400, body: '{}' };
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-5-5',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await r.json();
    const text = (data.content || []).map(c => c.text || '').join('')
      .replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    return { statusCode: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify(parsed) };
  } catch (e) {
    return { statusCode: 500, body: '{}' };
  }
};
