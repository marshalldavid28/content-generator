import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Generate engaging social media content for ${prompt.platform}. 
                 Topic: ${prompt.topic}
                 Tone: ${prompt.tone}
                 
                 Create content that is specifically optimized for ${prompt.platform}, 
                 including appropriate formatting and any relevant hashtags or mentions.
                 Keep the content concise and engaging.`
      }]
    });

    res.status(200).json({ content: message.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error generating content' });
  }
}
