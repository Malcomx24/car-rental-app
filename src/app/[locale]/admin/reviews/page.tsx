"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/star-rating";
import { formatDate } from "@/lib/utils";
import { Loader2, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  car: { id: string; name: string; brand: { name: string } };
}

export default function AdminReviewsPage() {
  const t = useTranslations("admin");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (filter !== "all") params.set("status", filter);
      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const updateReview = async (id: string, isApproved: boolean) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm(t("confirmDeleteReview"))) return;
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("reviewManagement")}</h1>
        <p className="text-muted-foreground mt-1">{total} {t("totalReviews")}</p>
      </div>

      <div className="flex gap-2">
        {(["all", "pending", "approved"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => { setFilter(f); setPage(1); }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">{t("noReviewsYet")}</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{review.user.firstName} {review.user.lastName}</p>
                      <span className="text-xs text-muted-foreground">{t("on")}</span>
                      <p className="text-sm font-medium">{review.car.brand.name} {review.car.name}</p>
                      <Badge variant={review.isApproved ? "default" : "secondary"}>
                        {review.isApproved ? t("approved") : t("pending")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={review.rating} readonly size="sm" />
                      <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                    </div>
                    {review.title && <p className="font-medium mt-2">{review.title}</p>}
                    <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">{review.user.email}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!review.isApproved && (
                      <Button size="sm" variant="outline" onClick={() => updateReview(review.id, true)} disabled={updating === review.id}>
                        <CheckCircle className="h-4 w-4 mr-1" /> {t("approve")}
                      </Button>
                    )}
                    {review.isApproved && (
                      <Button size="sm" variant="outline" onClick={() => updateReview(review.id, false)} disabled={updating === review.id}>
                        <XCircle className="h-4 w-4 mr-1" /> {t("unapprove")}
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => deleteReview(review.id)} disabled={updating === review.id}>
                      {t("delete")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("showing")} {((page - 1) * 15) + 1}–{Math.min(page * 15, total)} {t("to")} {total}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
