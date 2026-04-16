const Anthropic = require("@anthropic-ai/sdk");

exports.handler = async function(event) {
  try {
    const { prompt } = JSON.parse(event.body);

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: message.content[0].text
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
