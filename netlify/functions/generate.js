const fs = require('fs');
const path = require('path');

// Load and parse the fragrance database
function loadFragranceDatabase() {
  const csvPath = path.join(__dirname, '../../fragrances_final.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');
  const fragrances = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.split(';');
    if (cols.length < 9) continue;
    fragrances.push({
      name: cols[0],
      brand: cols[1],
      gender: cols[2],
      topNotes: cols[5],
      middleNotes: cols[6],
      baseNotes: cols[7],
      accords: cols[8]
    });
  }
  return fragrances;
}

// Filter by gender based on quiz scent_direction answer
function filterByGender(fragrances, profileSummary) {
  const lower = profileSummary.toLowerCase();
  if (lower.includes('scent_direction: masculine')) {
    return fragrances.filter(f => f.gender === 'men' || f.gender === 'unisex');
  }
  if (lower.includes('scent_direction: feminine')) {
    return fragrances.filter(f => f.gender === 'women' || f.gender === 'unisex');
  }
  return fragrances;
}

// Build a randomised shortlist to pass to the AI
function buildFragranceList(fragrances, limit = 500) {
  const shuffled = [...fragrances].sort(() => Math.random() - 0.5).slice(0, limit);
  return shuffled.map(f =>
    `${f.name} by ${f.brand} | Notes: ${[f.topNotes, f.middleNotes, f.baseNotes].filter(Boolean).join(', ')} | Accords: ${f.accords}`
  ).join('\n');
}

exports.handler = async function(event) {
  try {
    const { prompt } = JSON.parse(event.body);

    // Load and filter database
    const allFragrances = loadFragranceDatabase();
    const filtered = filterByGender(allFragrances, prompt);
    const fragranceList = buildFragranceList(filtered);

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
        messages: [{
          role: "user",
          content: `${prompt}

FRAGRANCE LIST - SELECT FROM THIS LIST ONLY:
${fragranceList}

Select one Safe Match, one Statement Match and one Wildcard Match from the list above only. Copy fragrance_name and brand exactly as they appear in the list.

Return JSON in this exact format:
{
  "personality_profile": { "summary": "2-3 sentences", "traits": ["trait1", "trait2"] },
  "recommendations": [
    {
      "fragrance_name": "exact name from list",
      "brand": "exact brand from list",
      "confidence_score": 85,
      "smells_like": "3-5 notes",
      "why_this_works": "reasoning",
      "why_this_suits": "one sentence"
    },
    {
      "fragrance_name": "exact name from list",
      "brand": "exact brand from list",
      "confidence_score": 85,
      "smells_like": "3-5 notes",
      "why_this_works": "reasoning",
      "why_this_suits": "one sentence"
    },
    {
      "fragrance_name": "exact name from list",
      "brand": "exact brand from list",
      "confidence_score": 85,
      "smells_like": "3-5 notes",
      "why_this_works": "reasoning",
      "why_this_suits": "one sentence"
    }
  ]
}`
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    const text = data.content?.[0]?.text?.trim();
    if (!text) {
      return { statusCode: 500, body: JSON.stringify({ error: "No content returned" }) };
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
      body: JSON.stringify({ error: error.message })
    };
  }
};
