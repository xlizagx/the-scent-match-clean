// Placeholder file — Base44 has been removed from this project.
// This file exists only to prevent build errors in files that still import it.
// These files can be cleaned up in a future session.

export const base44 = {
  auth: {
    me: async () => null,
    logout: () => {},
    redirectToLogin: () => {}
  },
  integrations: {
    Core: {
      InvokeLLM: async () => ({ recommendations: [] })
    }
  },
  entities: {
    SupportTicket: {
      create: async () => null
    },
    Testimonial: {
      create: async () => null
    }
  }
};
