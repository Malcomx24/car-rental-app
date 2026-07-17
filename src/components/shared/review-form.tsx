"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/shared/star-rating";
import { Loader2, Send, CheckCircle } from "lucide-react";

interface ReviewFormProps {
  carId: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ carId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (comment.length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, rating, title: title || undefined, comment }),
      });

      if (res.ok) {
        setSubmitted(true);
        setRating(0);
        setTitle("");
        setComment("");
        onReviewSubmitted?.();
      } else {
        const json = await res.json();
        setError(json.error || "Failed to submit review");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
          <h3 className="font-semibold text-lg">Review Submitted!</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Thank you for your feedback. Your review will be visible after approval.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
            Write Another Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rating *</Label>
            <div className="mt-1">
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
          </div>
          <div>
            <Label htmlFor="review-title">Title (optional)</Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="mt-1"
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="review-comment">Review *</Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this car..."
              rows={4}
              className="mt-1"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">{comment.length}/1000</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Submit Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
