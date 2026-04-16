import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Zap, Star, Flower2, Wind, Flame, Leaf, TreePine, Citrus, Droplets, Sparkles, Cookie } from 'lucide-react';

const NOTE_ICONS = [
  { keywords: ['vanilla', 'tonka', 'praline', 'custard', 'sweet', 'creamy', 'warm vanilla', 'soft vanilla'], icon: Cookie, label: 'Vanilla' },
  { keywords: ['caramel', 'toffee', 'butterscotch', 'honey', 'honeyed', 'syrupy'], icon: Cookie, label: 'Caramel' },
  { keywords: ['musk', 'musky', 'cashmeran', 'ambrette', 'white musk', 'skin musk', 'clean musk', 'powdery musk', 'soft musk'], icon: Wind, label: 'Musk' },
  { keywords: ['rose', 'rose petal', 'rosewood', 'damask rose', 'turkish rose', 'rose absolute'], icon: Flower2, label: 'Rose' },
  { keywords: ['jasmine', 'peony', 'iris', 'gardenia', 'tuberose', 'lily', 'magnolia', 'violet', 'floral', 'white flower', 'blossom', 'bloom', 'narcissus', 'mimosa', 'freesia', 'ylang'], icon: Flower2, label: 'Floral' },
  { keywords: ['amber', 'ambergris', 'resin', 'balsam', 'benzoin', 'labdanum', 'warm amber', 'golden amber', 'rich amber', 'oriental', 'cosy', 'cozy', 'warm'], icon: Flame, label: 'Amber' },
  { keywords: ['oud', 'agarwood', 'oud wood', 'dark oud', 'smoky oud', 'rich oud'], icon: TreePine, label: 'Oud' },
  { keywords: ['tobacco', 'leather', 'birch', 'smoke', 'incense', 'smoky', 'smoked', 'dark', 'tar'], icon: Flame, label: 'Tobacco' },
  { keywords: ['pepper', 'cardamom', 'cinnamon', 'ginger', 'saffron', 'nutmeg', 'clove', 'spice', 'spicy', 'spiced', 'black pepper', 'pink pepper', 'anise', 'star anise'], icon: Sparkles, label: 'Spice' },
  { keywords: ['bergamot', 'lemon', 'orange', 'grapefruit', 'mandarin', 'lime', 'neroli', 'yuzu', 'citrus', 'zesty', 'citrusy', 'fresh citrus', 'tangy', 'bright citrus'], icon: Citrus, label: 'Citrus' },
  { keywords: ['aquatic', 'marine', 'ozonic', 'sea', 'ocean', 'water', 'watery', 'fresh water', 'sea salt', 'salty', 'coastal'], icon: Droplets, label: 'Aquatic' },
  { keywords: ['vetiver', 'moss', 'fern', 'basil', 'mint', 'herbal', 'green', 'fresh green', 'grassy', 'earthy green', 'oakmoss', 'geranium'], icon: Leaf, label: 'Green' },
  { keywords: ['cedar', 'sandalwood', 'patchouli', 'guaiac', 'teak', 'woody', 'wood', 'woods', 'warm wood', 'dry wood', 'rich wood', 'creamy wood', 'cashwood', 'oak', 'driftwood', 'birchwood'], icon: TreePine, label: 'Wood' },
  { keywords: ['cherry', 'peach', 'apricot', 'plum', 'lychee', 'raspberry', 'blackberry', 'pear', 'apple', 'almond', 'fruity', 'fruit', 'juicy', 'red fruits', 'dark fruits', 'berry', 'fig', 'mango', 'passion fruit', 'pomegranate'], icon: Citrus, label: 'Fruit' },
];

function NoteIcons({ text }) {
  if (!text) return null;
  const lower = text.toLowerCase();
  const matched = NOTE_ICONS.filter(({ keywords }) => keywords.some(k => lower.includes(k)));
  const seen = new Set();
  const unique = matched.filter(({ label }) => seen.has(label) ? false : seen.add(label)).slice(0, 6);
  if (!unique.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {unique.map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground font-body bg-secondary/60 rounded-full px-2.5 py-1">
          <Icon className="w-3 h-3 text-primary/70" />
          {label}
        </span>
      ))}
    </div>
  );
}

const tierConfig = {
  safe: {
    label: 'Safe Match',
    icon: ShieldCheck,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  statement: {
    label: 'Statement Choice',
    icon: Zap,
    accent: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
  },
  wildcard: {
    label: 'Wildcard Discovery',
    icon: Star,
    accent: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
  },
  // legacy fallbacks
  exciting: {
    label: 'Statement Choice',
    icon: Zap,
    accent: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
  },
  unexpected: {
    label: 'Wildcard Discovery',
    icon: Star,
    accent: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
  },
};

export default function FragranceCard({ recommendation, tier, index, isSelf }) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={`bg-card border ${config.border} rounded-2xl overflow-hidden`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${config.accent}`} />
            </div>
            <span className={`text-xs font-body font-semibold tracking-wider uppercase ${config.accent}`}>
              {config.label}
            </span>
          </div>
          <Badge variant="outline" className={`${config.border} ${config.accent} font-body text-xs`}>
            {recommendation.confidence_score}% match
          </Badge>
        </div>

        {/* Fragrance Name */}
        <h3 className="font-heading text-xl md:text-2xl text-foreground mb-1">
          {recommendation.fragrance_name}
        </h3>
        <p className="text-sm text-muted-foreground font-body mb-4">
          {recommendation.brand}
        </p>

        {/* Smells Like */}
        <div className="bg-secondary/50 rounded-xl p-4 mb-4">
          <span className="text-xs font-body font-medium tracking-wider uppercase text-muted-foreground block mb-1">
            Smells Like
          </span>
          <p className="text-sm text-foreground font-body leading-relaxed">
            {recommendation.smells_like}
          </p>
          <NoteIcons text={recommendation.smells_like} />
        </div>

        {/* Why This Suits */}
        {recommendation.why_this_suits && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-4">
            <span className="text-xs font-body font-medium tracking-wider uppercase text-primary block mb-1">
              {isSelf ? 'Why this suits you' : 'Why this suits them'}
            </span>
            <p className="text-sm text-foreground font-body leading-relaxed">
              {recommendation.why_this_suits}
            </p>
          </div>
        )}

        {/* Why They'll Love This */}
        {recommendation.why_this_works && (
          <div className="bg-secondary/50 rounded-xl p-4 mb-4">
            <span className="text-xs font-body font-medium tracking-wider uppercase text-muted-foreground block mb-1">
              {isSelf ? "Why you'll love this" : "Why they'll love this"}
            </span>
            <p className="text-sm text-foreground font-body leading-relaxed">
              {recommendation.why_this_works}
            </p>
          </div>
        )}


      </div>
    </motion.div>
  );
}