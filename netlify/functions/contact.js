exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { type, name, email, issue_type, message, location, quote } = JSON.parse(event.body || "{}");

    let subject, html;

    if (type === 'contact') {
      if (!name || !email || !message) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Name, email and message are required" })
        };
      }

      subject = `New Contact Form Submission - ${issue_type || 'General Enquiry'}`;
      html = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #1a1a1a;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Issue Type:</strong> ${issue_type || 'General Enquiry'}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f5f5f5; padding: 12px; border-radius: 8px;">${message}</p>
        </div>
      `;

    } else if (type === 'review') {
      if (!name || !quote) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Name and review are required" })
        };
      }

      subject = `New Review Submission from ${name}`;
      html = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #1a1a1a;">New Review Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Location:</strong> ${location || 'Not provided'}</p>
          <p><strong>Review:</strong></p>
          <p style="background: #f5f5f5; padding: 12px; border-radius: 8px;">${quote}</p>
          <p style="color: #888; font-size: 12px;">To add this review to the site, add it to the SEED_TESTIMONIALS array in TestimonialsSection.jsx</p>
        </div>
      `;

    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid form type" })
      };
    }

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
        to: [{ email: "info@thescentmatch.com" }],
        subject,
        htmlContent: html
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
