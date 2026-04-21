import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Sparkles, CheckCircle } from 'lucide-react';
import QuizQuestion from './QuizQuestion';

function getLabel(questions, questionId, value) {
  const q = questions.find(q => q.id === questionId);
  if (!q || !value) return null;
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return value.map(v => {
      const opt = q.options?.find(o => o.value === v);
      return opt?.label || v;
    }).join(' · ');
  }
  if (value === 'skip') return null;
  if (q.type === 'text') return value || null;
  const opt = q.options?.find(o => o.value === value);
  return opt?.label || value;
}

export default function QuizReview({ answers, questions, onAnswerUpdate, onConfirm, onBack }) {
  const [editingId, setEditingId] = useState(null);

  const handleEditClick = (id) => {
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSingleAnswer = (value) => {
    onAnswerUpdate(editingId, value);
  };

  const handleDoneEditing = () => {
    setEditingId(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (editingId) {
    const question = questions.find(q => q.id === editingId);
    if (question) {
      const currentAnswer = answers[editingId];
      const canProceed =
        question.type === 'text' ||
        (question.type === 'multiselect'
          ? Array.isArray(currentAnswer) && currentAnswer.length > 0
          : !!currentAnswer);

      return (
        <div className="min-h-screen px-6 py-20">
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <button
                onClick={handleDoneEditing}
                className="flex items-center gap-1.5 text-xs text-muted-foreground font-body hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Review
              </button>
              <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary block mb-2">
                Edit Answer
              </span>
            </div>

            <AnimatePresence mode="wait">
              <QuizQuestion
                key={editingId}
                question={question}
                onAnswer={handleSingleAnswer}
                currentAnswer={currentAnswer}
              />
            </AnimatePresence>

            <div className="flex justify-end mt-10">
              <Button
                onClick={handleDoneEditing}
                disabled={!canProceed && question.type !== 'text'}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full px-6 h-11"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Back to Review
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  const reviewItems = questions
    .map(q => {
      const label = getLabel(questions, q.id, answers[q.id]);
      return { id: q.id, title: q.title, label };
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xs font-body font-medium tracking-[0.25em] uppercase text-primary mb-3 block">
            Almost there
          </span>
          <h2 className="font-heading text-3xl text-foreground mb-3 leading-tight">
            Review Your Answers
          </h2>
          <p className="text-sm text-muted-foreground font-heading italic font-normal leading-relaxed max-w-sm mx-auto">
            Take a moment to check your selections before we unlock your personalised match.
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl divide-y divide-border/50 mb-8">
          {reviewItems.map(item => (
            <div key={item.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-xs text-muted-foreground font-body mb-0.5 truncate">{item.title}</p>
                <p className="text-sm text-foreground font-body font-medium">
                  {item.label || <span className="text-muted-foreground italic">Not answered</span>}
                </p>
              </div>
              <button
                onClick={() => handleEditClick(item.id)}
                className="shrink-0 flex items-center gap-1.5 text-xs text-primary font-body font-medium hover:text-primary/70 transition-colors"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
            </div>
          ))}
        </div>

        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="font-body text-sm text-muted-foreground mb-4 w-full flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to questions
          </Button>
        )}

        <Button
          onClick={onConfirm}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-sm tracking-wide rounded-full h-12 w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Pay £4.99 — Unlock My Matches
        </Button>

        <p className="text-center text-xs text-muted-foreground font-body mt-4">
          One-time payment · Instant results
        </p>
      </motion.div>
    </div>
  );
}
