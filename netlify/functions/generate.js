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

// Filter by gender based on quiz answers
function filterByGender(fragrances, profileSummary) {
  const lower = profileSummary.toLowerCase();
  if (lower.includes('gender: male') || lower.includes('gender: men') || lower.includes('for: men')) {
    return fragrances.filter(f => f.gender === 'men' || f.gender === 'unisex');
  }
  if (lower.includes('gender: female') || lower.includes('gender: women') || lower.includes('for: women')) {
    return fragrances.filter(f => f.gender === 'women' || f.gender === 'unisex');
  }
  return fragrances;
}

// Build a randomised shortlist to pass to the AI
function buildFragranceList(fragrances, limit = 600) {
  const shuffled = [...fragrances].sort(() => Math.random() - 0.5).slice(0, limit);
  return shuffled.map(f =>
    `${f.name} by ${f.brand} | Notes: ${[f.topNotes, f.middleNotes, f.baseNotes].filter(Boolean).join(', ')} | Accords: ${f.accords}`
  ).join('\n');
}

// Single API call helper
async function callClaude(userPrompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: "Return ONLY valid JSON. Do not include markdown, explanation, or code fences.",
      messages: [{ role: "user", content: userPrompt }]
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));

  const text = data.content?.[0]?.text?.trim();
  if (!text) throw new Error("No content returned");

  const clean = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(clean);
}

exports.handler = async function(event) {
  try {
    const { prompt } = JSON.parse(event.body);

    // Load and filter database
    const allFragrances = loadFragranceDatabase();
    const filtered = filterByGender(allFragrances, prompt);

    // CALL 1 - Safe Match + personality profile
    const safeList = buildFragranceList(filtered);
    const safeResult = await callClaude(`${prompt}

FRAGRANCE DATABASE - ONLY RECOMMEND FROM THIS LIST:
${safeList}

Select the single best SAFE MATCH from the list above only. Return JSON with:
{
  "personality_profile": { "summary": "2-3 sentences warm editorial tone", "traits": ["4-6 short labels"] },
  "fragrance_name": "exact name from list",
  "brand": "exact brand from list",
  "confidence_score": 70-98,
  "smells_like": "3-5 notes plain English",
  "why_this_works": "personality-connected reasoning",
  "why_this_suits": "concise sentence"
}`);

    // CALL 2 - Statement Match
    const statementList = buildFragranceList(filtered);
    const statementResult = await callClaude(`${prompt}

FRAGRANCE DATABASE - ONLY RECOMMEND FROM THIS LIST:
${statementList}

Select the single best STATEMENT MATCH from the list above only. Return JSON with:
{
  "fragrance_name": "exact name from list",
  "brand": "exact brand from list",
  "confidence_score": 70-98,
  "smells_like": "3-5 notes plain English",
  "why_this_works": "personality-connected reasoning",
  "why_this_suits": "concise sentence"
}`);

    // CALL 3 - Wildcard Match
    const wildcardList = buildFragranceList(filtered);
    const wildcardResult = await callClaude(`${prompt}

FRAGRANCE DATABASE - ONLY RECOMMEND FROM THIS LIST:
${wildcardList}

Select the single best WILDCARD MATCH from the list above only. Return JSON with:
{
  "fragrance_name": "exact name from list",
  "brand": "exact brand from list",
  "confidence_score": 70-98,
  "smells_like": "3-5 notes plain English",
  "why_this_works": "personality-connected reasoning",
  "why_this_suits": "concise sentence"
}`);

    // Assemble final response
    const finalResponse = {
      personality_profile: safeResult.personality_profile,
      recommendations: [
        {
          fragrance_name: safeResult.fragrance_name,
          brand: safeResult.brand,
          confidence_score: safeResult.confidence_score,
          smells_like: safeResult.smells_like,
          why_this_works: safeResult.why_this_works,
          why_this_suits: safeResult.why_this_suits
        },
        {
          fragrance_name: statementResult.fragrance_name,
          brand: statementResult.brand,
          confidence_score: statementResult.confidence_score,
          smells_like: statementResult.smells_like,
          why_this_works: statementResult.why_this_works,
          why_this_suits: statementResult.why_this_suits
        },
        {
          fragrance_name: wildcardResult.fragrance_name,
          brand: wildcardResult.brand,
          confidence_score: wildcardResult.confidence_score,
          smells_like: wildcardResult.smells_like,
          why_this_works: wildcardResult.why_this_works,
          why_this_suits: wildcardResult.why_this_suits
        }
      ]
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalResponse)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
