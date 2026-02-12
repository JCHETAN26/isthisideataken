
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    description: string;
    published_at: string;
    views: number;
    author_id: string; // We could fetch author profile if needed
}

const BlogIndex = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('published', true)
                    .order('published_at', { ascending: false });

                if (error) throw error;
                setPosts(data || []);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>Blog - IsThisIdeaTaken</title>
                <meta name="description" content="Insights, trends, and guides on startup idea validation and market research." />
            </Helmet>

            <Navbar />

            <main className="container max-w-5xl mx-auto px-4 pt-24 pb-16">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Startup Insights
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Expert guides on validating ideas, researching markets, and launching successful products.
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 rounded-xl border border-border bg-card/50 animate-pulse" />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug}`}
                                className="group flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Draft'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            5 min read
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                                        {post.description}
                                    </p>

                                    <div className="flex items-center text-sm font-medium text-primary mt-auto">
                                        Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 rounded-xl border border-dashed border-border bg-card/50">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                            <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            We're writing some amazing content for you. Check back soon!
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BlogIndex;
