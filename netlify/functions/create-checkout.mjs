export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const { default: Stripe } = await import('stripe');
  const stripe = new Stripe(stripeKey);

  const body = await request.json();
  const { isAddon } = body;
  const price = isAddon ? 199 : 499;
  const label = isAddon
    ? 'The Scent Match — Another Round of Recommendations'
    : 'The Scent Match — 3 Personalised Fragrance Recommendations';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'paypal'],
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: { name: label },
        unit_amount: price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `https://poetic-bunny-d6e867.netlify.app/quiz?payment=success&addon=${isAddon ? 'true' : 'false'}`,
    cancel_url: `https://poetic-bunny-d6e867.netlify.app/quiz?payment=cancelled`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const config = {
  path: '/api/create-checkout'
};
