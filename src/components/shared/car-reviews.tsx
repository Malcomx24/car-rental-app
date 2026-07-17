"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { formatDate } from "@/lib/utils";
import { Loader2, MessageSquare, ChevronDown, Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; avatar: string | null };
}

interface RatingStats {
  average: number;
  total: number;
  distribution: { rating: number; count: number }[];
}

interface CarReviewsProps {
  carId: string;
}

export function CarReviews({ carId }: CarReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchReviews = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?carId=${carId}&page=${p}&limit=5`);
      const json = await res.json();
      if (json.success) {
        setReviews((prev) => (p === 1 ? json.data : [...prev, ...json.data]));
        setStats(json.stats);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [carId]);

  useEffect(() => { fetchReviews(1); }, [fetchReviews]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage);
  };

  if (!stats || (stats.total === 0 && reviews.length === 0)) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="font-medium">No reviews yet</p>
        <p className="text-sm text-muted-foreground mt-1">Be the first to review this car.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="text-center sm:text-left">
          <p className="text-5xl font-bold">{Number(stats.average).toFixed(1)}</p>
          <StarRating value={Number(stats.average)} readonly size="md" />
          <p className="text-sm text-muted-foreground mt-1">{stats.total} review{stats.total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {stats.distribution.map((d) => (
            <div key={d.rating} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-right">{d.rating}</span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: stats.total > 0 ? `${(d.count / stats.total) * 100}%` : "0%" }}
                />
              </div>
              <span className="w-8 text-right text-muted-foreground">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                  {review.user.avatar ? (
                    <img src={review.user.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {review.user.firstName[0]}{review.user.lastName[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{review.user.firstName} {review.user.lastName}</p>
                    <StarRating value={review.rating} readonly size="sm" />
                    <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                  </div>
                  {review.title && <p className="font-medium mt-1">{review.title}</p>}
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {page < totalPages && (
        <div className="text-center">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
}
