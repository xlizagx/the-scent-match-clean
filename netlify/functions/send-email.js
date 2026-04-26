exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { email, results, profile } = JSON.parse(event.body || "{}");

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email address is required" }),
      };
    }

    const tiers = ['Safe Choice', 'Exciting Choice', 'Unexpected Wow'];

    const recommendationsHtml = Array.isArray(results)
      ? results.map((r, i) => `
        <div style="margin-bottom: 32px; padding: 24px; background-color: #1a1a1a; border-radius: 12px; border-left: 3px solid #C9A84C;">
          <p style="margin: 0 0 4px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A84C; font-family: sans-serif;">${tiers[i] || 'Recommendation'}</p>
          <h2 style="margin: 0 0 4px 0; font-size: 22px; color: #ffffff; font-family: Georgia, serif;">${r.fragrance_name || ''}</h2>
          <p style="margin: 0 0 12px 0; font-size: 13px; color: #888888; font-family: sans-serif;">by ${r.brand || ''}</p>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #cccccc; font-family: sans-serif;"><strong style="color: #C9A84C;">Smells like:</strong> ${r.smells_like || ''}</p>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #cccccc; font-family: sans-serif;"><strong style="color: #C9A84C;">Why it works:</strong> ${r.why_this_works || ''}</p>
          <p style="margin: 0; font-size: 12px; color: #888888; font-family: sans-serif;">Match confidence: ${r.confidence_score || 'N/A'}%</p>
        </div>
      `).join('')
      : `<p style="font-size: 15px; color: #cccccc;">Your fragrance matches are ready.</p>`;

    const profileHtml = profile ? `
      <div style="margin-bottom: 32px; padding: 20px; background-color: #111111; border-radius: 12px;">
        <p style="margin: 0 0 8px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A84C; font-family: sans-serif;">Personality Profile</p>
        <p style="margin: 0; font-size: 14px; color: #cccccc; font-family: sans-serif; line-height: 1.6;">${profile.summary || ''}</p>
      </div>
    ` : '';

    const html = `
      <div style="background-color: #0a0a0a; padding: 48px 24px; font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="margin: 0 0 8px 0; font-size: 28px; color: #ffffff; font-family: Georgia, serif;">Your Personalised Fragrance Matches</h1>
          <p style="margin: 0; font-size: 14px; color: #888888;">From The Scent Match</p>
        </div>

        <p style="font-size: 15px; color: #cccccc; line-height: 1.7; margin-bottom: 32px;">
          Thank you for trusting The Scent Match. Below are your three individually curated fragrance recommendations.
        </p>

        ${profileHtml}
        ${recommendationsHtml}

        <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #222222; text-align: center;">
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #888888;">Save this email to revisit your matches anytime.</p>
          <a href="https://thescentmatch.com" style="display: inline-block; padding: 12px 28px; background-color: #C9A84C; color: #000000; text-decoration: none; border-radius: 50px; font-size: 13px; font-weight: bold; letter-spacing: 0.05em;">Visit The Scent Match</a>
        </div>

        <div style="margin-top: 40px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #555555;">With warmth,<br/>The Scent Match Team</p>
        </div>
      </div>
    `;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "The Scent Match",
          email: "hello@thescentmatch.com"
        },
        to: [{ email }],
        subject: "Your Personalised Fragrance Matches — The Scent Match",
        htmlContent: html
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    console.error('Email send error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
