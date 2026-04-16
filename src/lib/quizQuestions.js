export const quizQuestions = [
  {
    id: 'relationship',
    title: "What is your relationship to them?",
    subtitle: "Different relationships often call for different scent styles and gifting moods.",
    type: 'select',
    options: [
      { value: 'spouse_partner', label: 'Spouse or partner', description: 'Intimate, deeply personal, meaningful' },
      { value: 'new_relationship', label: 'New relationship', description: 'Exciting, impressionable, a statement of care' },
      { value: 'friend', label: 'Friend', description: 'Celebratory, warm, full of personality' },
      { value: 'family_member', label: 'Family member', description: 'Thoughtful, timeless, deeply considered' },
      { value: 'colleague', label: 'Colleague', description: 'Polished, appropriate, impressive' },
    ]
  },
  {
    id: 'personality',
    title: "How would you describe their personality?",
    subtitle: "Think about their natural energy and how they carry themselves day to day.",
    type: 'select',
    options: [
      { value: 'quiet', label: 'Quiet & Reserved', description: 'Calm, introspective, thoughtful presence' },
      { value: 'confident', label: 'Confident & Assured', description: 'Self-possessed, natural leader energy' },
      { value: 'bold', label: 'Bold & Magnetic', description: 'Commanding attention, fearless, charismatic' },
      { value: 'soft', label: 'Soft & Gentle', description: 'Warm, nurturing, approachable and kind' },
      { value: 'playful', label: 'Playful & Vibrant', description: 'Energetic, fun-loving, lights up a room' },
    ]
  },
  {
    id: 'scent_direction',
    title: "What scent style would suit them best?",
    subtitle: "Choose the fragrance energy they'll naturally gravitate towards.",
    type: 'select',
    options: [
      { value: 'feminine', label: 'Feminine leaning', description: 'Soft, floral, romantic, or sensual' },
      { value: 'masculine', label: 'Masculine leaning', description: 'Bold, woody, fresh, or structured' },
      { value: 'unisex', label: 'Unisex', description: 'Fluid, modern, transcends categories' },
      { value: 'open', label: 'Open to anything', description: 'Let the personality and profile guide it' },
    ]
  },
  {
    id: 'style',
    title: "What best describes their personal style?",
    subtitle: "How they present themselves to the world tells us a lot about scent preference.",
    type: 'select',
    options: [
      { value: 'minimal', label: 'Minimal & Clean', description: 'Less is more — refined simplicity' },
      { value: 'polished', label: 'Polished & Classic', description: 'Timeless elegance, always well put-together' },
      { value: 'statement', label: 'Statement & Luxe', description: 'Bold choices, high-impact fashion, designer-led' },
      { value: 'trendy', label: 'Trendy & Current', description: 'Always ahead, loves what\'s new and now' },
    ]
  },
  {
    id: 'scent_family',
    title: "Which scent world would appeal to them most?",
    subtitle: "Don't worry if you're unsure, we've explained each fragrance style to help you.",
    type: 'select',
    options: [
      { value: 'gourmand', label: 'Gourmand', description: 'Sweet, edible notes — think vanilla, caramel, chocolate, warm cookies' },
      { value: 'fresh', label: 'Fresh', description: 'Clean and airy — citrus, cool water, crisp linen, morning dew' },
      { value: 'floral', label: 'Floral', description: 'Soft petals and romantic blooms — rose, jasmine, peony, feminine elegance' },
      { value: 'woody', label: 'Woody', description: 'Warm depth — creamy sandalwood, smoky oud, cedar, earthy sophistication' },
    ]
  },
  {
    id: 'fragrance_world',
    title: "Which fragrance category would appeal to them most?",
    subtitle: "Choose up to two. This shapes the fragrance houses and categories we recommend from.",
    type: 'multiselect',
    maxSelections: 2,
    options: [
      { value: 'designer', label: 'Designer', description: 'Trusted names — Dior, Chanel, YSL, Hermès, Jo Malone' },
      { value: 'luxury_niche', label: 'Luxury niche & discovery', description: 'Elevated — MFK, Amouage, Parfums de Marly, Xerjoff, Nishane, BDK, Goldfield & Banks' },
      { value: 'middle_eastern', label: 'Middle Eastern', description: 'Rich & opulent — Afnan, Lattafa, Armaf, Rasasi, Swiss Arabian' },
      { value: 'surprise', label: 'Open to the best fit', description: 'This lets us curate the best overall fit for them.' },
    ]
  },
  {
    id: 'occasion',
    title: "When will they wear this fragrance?",
    subtitle: "The occasion helps shape the ideal projection, mood, and character of the scent.",
    type: 'select',
    options: [
      { value: 'everyday', label: 'Everyday Signature', description: 'Their daily go-to — versatile and reliable' },
      { value: 'evening', label: 'Evening & Date Night', description: 'Seductive, deeper, more intimate' },
      { value: 'special', label: 'Special Occasions', description: 'Events, celebrations, memorable moments' },
      { value: 'work', label: 'Professional Setting', description: 'Office-appropriate, sophisticated, not overpowering' },
    ]
  },
  {
    id: 'season',
    title: "What season are you buying this fragrance for?",
    subtitle: "Seasonality helps shape the ideal depth, warmth, and character of the scent.",
    type: 'select',
    options: [
      { value: 'spring', label: 'Spring', description: 'Fresh, floral, light and uplifting' },
      { value: 'summer', label: 'Summer', description: 'Airy, citrus-bright, effortless warmth' },
      { value: 'autumn', label: 'Autumn', description: 'Spiced, amber-rich, cosy and warm' },
      { value: 'winter', label: 'Winter', description: 'Deep, opulent, rich and enveloping' },
      { value: 'all_year', label: 'Perfect all year round', description: 'A versatile signature for every season' },
    ]
  },
  {
    id: 'age_range',
    title: "What's their approximate age range?",
    subtitle: "This helps us refine towards age-appropriate choices.",
    type: 'select',
    options: [
      { value: '18-25', label: '18–25', description: 'Youthful, fresh, trend-aware' },
      { value: '26-35', label: '26–35', description: 'Established taste, open to discovery' },
      { value: '36-50', label: '36–50', description: 'Refined preferences, quality-focused' },
      { value: '50+', label: '50+', description: 'Classic elegance, timeless choices' },
      { value: 'skip', label: 'Prefer not to say', description: 'Skip this question' },
    ]
  },
  {
    id: 'budget',
    title: "What budget feels right?",
    subtitle: "This helps us balance the best match with the spend that feels comfortable to you.",
    type: 'select',
    options: [
      { value: 'under_100', label: 'Under £100', description: 'Great value picks across all fragrance worlds' },
      { value: '100_200', label: '£100–£200', description: 'Mid-to-premium range, broad selection' },
      { value: '200_plus', label: '£200+', description: 'Luxury and ultra-niche territory' },
      { value: 'open', label: 'Open to the best match', description: 'Let the best fit guide the recommendation' },
    ]
  },
  {
    id: 'known_fragrance',
    title: "Do they have a favourite perfume?",
    subtitle: "Don't worry if you don't know, but if you do, it helps us refine the match even further.",
    type: 'text',
    placeholder: "e.g. Chanel No.5, Aventus, Black Opium... or leave blank",
  },
];