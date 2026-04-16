import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Pencil, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function PersonalityProfile({ profile, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  if (!profile) return null;

  const handleEdit = () => {
    setDraft(profile.summary);
    setEditing(true);
  };

  const handleSave = () => {
    onUpdate({ ...profile, summary: draft });
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border/50 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-xs font-body font-medium tracking-wider uppercase text-primary block">
              Scent Personality
            </span>
            <h4 className="font-heading text-base text-foreground">Their Fragrance Profile</h4>
          </div>
        </div>
        {!editing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        )}
      </div>

      {/* Trait tags */}
      {profile.traits && profile.traits.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.traits.map((trait, i) => (
            <span
              key={i}
              className="text-xs font-body text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1"
            >
              {trait}
            </span>
          ))}
        </div>
      )}

      {editing ? (
        <div className="space-y-3">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="bg-secondary border-border/50 rounded-xl text-sm font-body min-h-[80px] resize-none"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-body text-xs h-8 px-4"
            >
              <Check className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button
              onClick={() => setEditing(false)}
              size="sm"
              variant="outline"
              className="rounded-full font-body text-xs h-8 px-4 border-border/50"
            >
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground font-body leading-relaxed">
          {profile.summary}
        </p>
      )}
    </motion.div>
  );
}