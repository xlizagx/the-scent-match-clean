exports.handler = async function(event) {
  try {
    const { prompt, schema } = JSON.parse(event.body);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: "Return ONLY valid JSON. Do not include markdown, explanation, or code fences.",
        messages: [
          {
            role: "user",
            content: `${prompt}
Return your answer as valid JSON matching this schema exactly:
${JSON.stringify(schema)}`
          }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(data)
      };
    }
    const text = data.content?.[0]?.text?.trim();
    if (!text) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No content returned from Claude", data })
      };
    }
    const clean = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    const parsed = JSON.parse(clean);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed)
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
