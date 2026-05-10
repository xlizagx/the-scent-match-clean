exports.handler = async function(event) {
  try {
    const { prompt, schema } = JSON.parse(event.body);

    // ── CALL 1: Generate recommendations ──────────────────────────────────
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: "Return ONLY valid JSON. Do not include markdown, explanation, or code fences.",
        messages: [
          {
            role: "user",
            content: `${prompt}\nReturn your answer as valid JSON matching this schema exactly:\n${JSON.stringify(schema)}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    const text = data.content?.[0]?.text?.trim();
    if (!text) {
      return { statusCode: 500, body: JSON.stringify({ error: "No content returned from Claude", data }) };
    }

    const clean = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const parsed = JSON.parse(clean);

    // ── CALL 2: Audit recommendations for hallucinations ──────────────────
    const recommendations = parsed.recommendations;

    const auditPrompt = `You are a fragrance verification expert. I will give you three fragrance recommendations. For each one, verify:
1. The fragrance name is real and exists
2. The brand name is real and exists
3. The fragrance name and brand are correctly paired - this exact fragrance is made by this exact brand
4. The fragrance is currently available to purchase

If all four checks pass, keep the recommendation exactly as is.
If any check fails, replace the entire recommendation with a different fragrance you are completely certain about - one that is real, correctly paired, currently available, and matches the same scent profile and tier.

Here are the three recommendations to verify:
${recommendations.map((r, i) => `${i + 1}. "${r.fragrance_name}" by ${r.brand} (${r.smells_like})`).join('\n')}

Return ONLY a valid JSON array of three objects, each with these exact fields:
- fragrance_name
- brand
- confidence_score
- smells_like
- why_this_works
- why_this_suits

Keep all original fields for any recommendation that passes verification. For any replacement, generate appropriate values for all fields. Do not include markdown, explanation, or code fences.`;

    const auditResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: "Return ONLY valid JSON. Do not include markdown, explanation, or code fences.",
        messages: [
          { role: "user", content: auditPrompt }
        ]
      })
    });

    const auditData = await auditResponse.json();
    const auditText = auditData.content?.[0]?.text?.trim();

    if (auditText) {
      const auditClean = auditText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

      const auditedRecommendations = JSON.parse(auditClean);
      parsed.recommendations = auditedRecommendations;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};    const clean = text
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
