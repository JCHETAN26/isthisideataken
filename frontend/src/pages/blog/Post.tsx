
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Calendar, User, Clock, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";

interface BlogPost {
    title: string;
    slug: string;
    description: string;
    content: string;
    published_at: string;
    meta_title?: string;
    meta_description?: string;
    author_id: string;
    og_image?: string;
}

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data, error } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('slug', slug)
                    .eq('published', true)
                    .single();

                if (error) throw error;
                setPost(data);

                // Increment views (optimistically optional)
                if (data) {
                    await supabase.from('blog_posts').update({ views: (data.views || 0) + 1 }).eq('id', data.id);
                }
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse flex flex-col items-center gap-4 w-full max-w-2xl px-4">
                    <div className="h-8 w-3/4 bg-border rounded-lg mb-4" />
                    <div className="h-4 w-1/2 bg-border rounded-lg mb-8" />
                    <div className="space-y-3 w-full">
                        <div className="h-4 bg-border rounded w-full" />
                        <div className="h-4 bg-border rounded w-full" />
                        <div className="h-4 bg-border rounded w-5/6" />
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                <h1 className="text-2xl font-bold mb-4">Post not found</h1>
                <p className="text-muted-foreground mb-8">The article you are looking for might have been removed or does not exist.</p>
                <Link to="/blog" className="text-primary hover:underline">
                    Back to all posts
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>{post.meta_title || post.title} - IsThisIdeaTaken</title>
                <meta name="description" content={post.meta_description || post.description} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.description} />
                {post.og_image && <meta property="og:image" content={post.og_image} />}
            </Helmet>

            <Navbar />

            <main className="container max-w-4xl mx-auto px-4 pt-24 pb-20">
                <article>
                    <header className="mb-12 text-center max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Draft'}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {Math.ceil(post.content.length / 1000)} min read
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {post.description}
                        </p>
                    </header>

                    <div className="h-px bg-border my-12" />

                    <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
                        <ReactMarkdown
                            components={{
                                h2: ({ children }) => <h2 className="text-2xl font-bold mt-12 mb-6 scroll-m-20 border-b pb-2 tracking-tight first:mt-0">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-xl font-semibold mt-8 mb-4 scroll-m-20 tracking-tight">{children}</h3>,
                                p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6 text-foreground/90">{children}</p>,
                                ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
                                ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
                                blockquote: ({ children }) => <blockquote className="mt-6 border-l-4 pl-6 italic text-muted-foreground border-primary/50 bg-secondary/20 py-2 rounded-r-lg">{children}</blockquote>,
                                a: ({ href, children }) => (
                                    <a href={href} className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">
                                        {children}
                                    </a>
                                ),
                                strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                                code: ({ children }) => <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">{children}</code>
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    <div className="mt-20 pt-10 border-t border-border">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">IT</div>
                                <div>
                                    <div className="font-semibold">Written by Team IdeaTaken</div>
                                    <div className="text-sm text-muted-foreground">Startup Validation Experts</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground mr-2">Share this:</span>
                                <button className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-foreground" aria-label="Share on Twitter">
                                    <Twitter className="h-4 w-4" />
                                </button>
                                <button className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-foreground" aria-label="Share on LinkedIn">
                                    <Linkedin className="h-4 w-4" />
                                </button>
                                <button className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-foreground" aria-label="Share on Facebook">
                                    <Facebook className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
};

export default BlogPost;
