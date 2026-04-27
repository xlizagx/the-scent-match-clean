exports.handler = async function(event) {
  try {
    const { prompt, schema } = JSON.parse(event.body);

    // ── STEP 1: Generate recommendations ──────────────────────────────────
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

    // ── STEP 2: Verify each recommendation via web search ─────────────────
    if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
      const verified = [];

      for (const rec of parsed.recommendations) {
        const isValid = await verifyFragrance(rec.fragrance_name, rec.brand);

        if (isValid) {
          verified.push(rec);
        } else {
          // Request one replacement based on quiz results
          const tierLabel = verified.length === 0 ? "Safe" : verified.length === 1 ? "Statement" : "Wildcard";
          const usedNames = [...verified.map(r => `${r.fragrance_name} by ${r.brand}`), `${rec.fragrance_name} by ${rec.brand}`];
          const replacement = await getReplacementFragrance(prompt, tierLabel, usedNames);

          if (replacement) {
            const replacementValid = await verifyFragrance(replacement.fragrance_name, replacement.brand);
            verified.push(replacementValid ? replacement : rec);
          } else {
            verified.push(rec);
          }
        }
      }

      parsed.recommendations = verified;
    }

    // ── STEP 3: Return verified results ───────────────────────────────────
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
};

// ── Verify fragrance exists and is available to purchase via web search ────
async function verifyFragrance(fragranceName, brand) {
  try {
    const verifyResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        system: "You are a fragrance fact-checker. Search the web and return ONLY valid JSON. No markdown, no explanation.",
        messages: [
          {
            role: "user",
            content: `Search the web for "${fragranceName} by ${brand} buy" to verify this fragrance exists, is genuinely made by ${brand}, and is currently available to purchase.

Return ONLY this JSON:
{
  "verified": true or false
}

Set verified to true ONLY if search results confirm the fragrance name and brand match and it is actively sold by a reputable retailer. Set to false if there is any doubt.`
          }
        ]
      })
    });

    const verifyData = await verifyResponse.json();
    const resultText = verifyData.content
      ?.filter(item => item.type === "text")
      ?.map(item => item.text)
      ?.join("") || "";

    const cleanResult = resultText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const result = JSON.parse(cleanResult);
    return result.verified === true;

  } catch {
    return true; // If verification fails to parse, pass through rather than discard
  }
}

// ── Get a replacement fragrance for a failed tier ─────────────────────────
async function getReplacementFragrance(originalPrompt, tier, usedFragrances) {
  try {
    const customerProfile = originalPrompt.split('CUSTOMER PROFILE')[1]?.split('\u2501')[0]?.trim() || "";

    const replacementResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: "Return ONLY valid JSON. No markdown, no explanation.",
        messages: [
          {
            role: "user",
            content: `A fragrance recommendation failed verification and must be replaced.

Customer profile:
${customerProfile}

Tier to replace: ${tier}
Do NOT recommend any of these: ${usedFragrances.join(', ')}

Recommend one replacement fragrance for the ${tier} tier that:
- Genuinely exists under the exact name you provide
- Is genuinely made by the exact brand you provide
- Is currently available to purchase from reputable retailers
- Suits the customer profile above

Return ONLY this JSON:
{
  "fragrance_name": "exact name",
  "brand": "exact brand",
  "confidence_score": 80,
  "smells_like": "vivid plain-English description of 3-5 notes",
  "why_this_works": "detailed personality-connected reasoning",
  "why_this_suits": "concise sentence on fit"
}`
          }
        ]
      })
    });

    const repData = await replacementResponse.json();
    const repText = repData.content?.[0]?.text?.trim() || "";
    const repClean = repText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    return JSON.parse(repClean);

  } catch {
    return null;
  }
}
