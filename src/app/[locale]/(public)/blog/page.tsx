import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t("blogTitle"),
    description: t("blogDescription"),
  };
}

export default async function BlogPage() {
  const t = await getTranslations("blog");

  const BLOG_POSTS = [
    {
      id: "top-10-luxury-cars-2025",
      title: t("posts.luxuryCars2025.title"),
      excerpt: t("posts.luxuryCars2025.excerpt"),
      category: t("categories.luxury"),
      date: "Jan 15, 2025",
      readTime: t("posts.luxuryCars2025.readTime"),
      image: "bg-gradient-to-br from-purple-500 to-pink-500",
      featured: true,
    },
    {
      id: "road-trip-guide-california",
      title: t("posts.californiaGuide.title"),
      excerpt: t("posts.californiaGuide.excerpt"),
      category: t("categories.travel"),
      date: "Jan 8, 2025",
      readTime: t("posts.californiaGuide.readTime"),
      image: "bg-gradient-to-br from-blue-500 to-cyan-500",
      featured: false,
    },
    {
      id: "ev-rental-guide",
      title: t("posts.evGuide.title"),
      excerpt: t("posts.evGuide.excerpt"),
      category: t("categories.electric"),
      date: "Jan 2, 2025",
      readTime: t("posts.evGuide.readTime"),
      image: "bg-gradient-to-br from-green-500 to-emerald-500",
      featured: false,
    },
    {
      id: "winter-driving-tips",
      title: t("posts.winterDriving.title"),
      excerpt: t("posts.winterDriving.excerpt"),
      category: t("categories.safety"),
      date: "Dec 20, 2024",
      readTime: t("posts.winterDriving.readTime"),
      image: "bg-gradient-to-br from-slate-500 to-blue-500",
      featured: false,
    },
    {
      id: "best-cars-for-families",
      title: t("posts.familyCars.title"),
      excerpt: t("posts.familyCars.excerpt"),
      category: t("categories.family"),
      date: "Dec 12, 2024",
      readTime: t("posts.familyCars.readTime"),
      image: "bg-gradient-to-br from-orange-500 to-red-500",
      featured: false,
    },
    {
      id: "sports-car-experience",
      title: t("posts.sportsCar.title"),
      excerpt: t("posts.sportsCar.excerpt"),
      category: t("categories.sports"),
      date: "Dec 5, 2024",
      readTime: t("posts.sportsCar.readTime"),
      image: "bg-gradient-to-br from-red-500 to-pink-500",
      featured: false,
    },
  ];

  const CATEGORY_COLORS: Record<string, string> = {
    [t("categories.luxury")]: "bg-purple-100 text-purple-700",
    [t("categories.travel")]: "bg-blue-100 text-blue-700",
    [t("categories.electric")]: "bg-green-100 text-green-700",
    [t("categories.safety")]: "bg-slate-100 text-slate-700",
    [t("categories.family")]: "bg-orange-100 text-orange-700",
    [t("categories.sports")]: "bg-red-100 text-red-700",
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 to-purple-950 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("heroTitle")}</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="container mx-auto px-4 py-12">
        {(() => {
          const featured = BLOG_POSTS.find((p) => p.featured);
          if (!featured) return null;
          return (
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="grid md:grid-cols-2">
                <div className={`${featured.image} min-h-[240px] md:min-h-[320px] flex items-center justify-center`}>
                  <span className="text-white/80 text-lg font-medium">{t("featured")}</span>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge className={`w-fit mb-3 ${CATEGORY_COLORS[featured.category] || "bg-gray-100 text-gray-700"}`}>
                    {featured.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">{featured.title}</h2>
                  <p className="text-muted-foreground mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />{featured.date}</div>
                    <div className="flex items-center gap-1"><Clock className="h-4 w-4" />{featured.readTime}</div>
                  </div>
                  <Link href={`/blog/${featured.id}`}>
                    <Button>
                      {t("readArticle")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          );
        })()}
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-8">{t("latestArticles")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.filter((p) => !p.featured).map((post) => (
            <Card key={post.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`${post.image} h-48 flex items-center justify-center`}>
                <Tag className="h-10 w-10 text-white/40" />
              </div>
              <CardContent className="p-6">
                <Badge className={`w-fit mb-3 text-xs ${CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-700"}`}>
                  {post.category}
                </Badge>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      {t("read")} <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
