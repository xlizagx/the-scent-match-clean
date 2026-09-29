exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { email, results } = JSON.parse(event.body || "{}");

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email is required" }),
      };
    }

    // Build recommendations (if they exist)
    const recommendationsHtml = Array.isArray(results)
      ? results.map((r, i) => `
        <div style="margin-bottom: 20px;">
          <p><strong>${r.fragrance_name || ''}</strong> by ${r.brand || ''}</p>
          <p>${r.smells_like || ''}</p>
          <p>${r.why_this_works || ''}</p>
        </div>
      `).join('')
      : `<p>Your fragrance matches are ready.</p>`;

    // Your email wording (your version)
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        
        <p>Hi there,</p>

        <p>Thank you for taking our fragrance quiz! Here are your personalised recommendations:</p>

        ${recommendationsHtml}

        <p>
          We hope you found your perfect scent match. If you did, we'd love to hear about it — 
          please take a moment to leave us a review, it means the world to a small business like ours.
        </p>

        <p>We hope to see you again soon!</p>

        <p>
          With love,<br/>
          The Scent Match Team<br/>
          info@thescentmatch.com
        </p>

      </div>
    `;

    // Send via Brevo
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
          email: "info@thescentmatch.com"
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
