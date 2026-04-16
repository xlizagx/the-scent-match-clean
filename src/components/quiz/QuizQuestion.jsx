import React from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Check } from 'lucide-react';

export default function QuizQuestion({ question, onAnswer, currentAnswer }) {
  // Multi-select question type
  if (question.type === 'multiselect') {
    const selected = Array.isArray(currentAnswer) ? currentAnswer : [];
    const max = question.maxSelections || 2;
    const isSurpriseSelected = selected.includes('surprise');

    const handleToggle = (value) => {
      if (value === 'surprise') {
        // Selecting "surprise" clears all others
        onAnswer(isSurpriseSelected ? [] : ['surprise']);
        return;
      }
      if (isSurpriseSelected) {
        // De-select surprise first, then select this
        onAnswer([value]);
        return;
      }
      if (selected.includes(value)) {
        onAnswer(selected.filter(v => v !== value));
      } else if (selected.length < max) {
        onAnswer([...selected, value]);
      }
    };

    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className="space-y-6"
      >
        <div>
          <h3 className="font-heading text-2xl text-foreground mb-2">{question.title}</h3>
          {question.subtitle && (
            <p className="text-sm text-muted-foreground font-body leading-relaxed">{question.subtitle}</p>
          )}
          <p className="text-xs text-primary font-body mt-2">
            {selected.length === 0 ? `Select up to ${max}` : `${selected.length} of ${max} selected`}
          </p>
        </div>
        <div className="grid gap-3">
          {question.options.map((option) => {
            const isSelected = selected.includes(option.value);
            const isDisabled = !isSelected && selected.length >= max && !isSurpriseSelected && option.value !== 'surprise';
            return (
              <button
                key={option.value}
                onClick={() => handleToggle(option.value)}
                disabled={isDisabled}
                className={`text-left p-4 rounded-xl border transition-all font-body ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : isDisabled
                    ? 'border-border/30 bg-card/50 opacity-40 cursor-not-allowed'
                    : 'border-border/50 bg-card hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground block">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground mt-1 block">{option.description}</span>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-3 ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Text question
  if (question.type === 'text') {
    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className="space-y-6"
      >
        <div>
          <h3 className="font-heading text-2xl text-foreground mb-2">{question.title}</h3>
          {question.subtitle && (
            <p className="text-sm text-muted-foreground font-body">{question.subtitle}</p>
          )}
        </div>
        <Input
          value={currentAnswer || ''}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder={question.placeholder}
          className="bg-secondary border-border/50 rounded-xl h-12 font-body text-sm"
        />
      </motion.div>
    );
  }

  // Single-select (default)
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h3 className="font-heading text-2xl text-foreground mb-2">{question.title}</h3>
        {question.subtitle && (
          <p className="text-sm text-muted-foreground font-body leading-relaxed">{question.subtitle}</p>
        )}
      </div>
      <div className="grid gap-3">
        {question.options.map((option) => {
          const isSelected = currentAnswer === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onAnswer(option.value)}
              className={`text-left p-4 rounded-xl border transition-all font-body ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border/50 bg-card hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-foreground block">{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground mt-1 block">{option.description}</span>
                  )}
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-3 ${
                  isSelected ? 'border-primary bg-primary' : 'border-border'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}