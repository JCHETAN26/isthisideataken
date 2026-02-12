
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Github, Mail } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { signInWithGithub, signInWithEmail } = useAuth();
    const navigate = useNavigate();

    const handleGithubLogin = async () => {
        try {
            setLoading(true);
            await signInWithGithub();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = await signInWithEmail(email);
            if (error) throw error;
            setMessage("Check your email for the login link!");
        } catch (error: any) {
            setMessage(error.message || "Error sending magic link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
                    <CardDescription className="text-center">
                        Choose your preferred sign in method
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Button variant="outline" onClick={handleGithubLogin} disabled={loading}>
                            <Github className="mr-2 h-4 w-4" />
                            Github
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                    <form onSubmit={handleEmailLogin}>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <Button className="w-full mt-4" type="submit" disabled={loading}>
                            {loading ? "Sending link..." : "Send Magic Link"}
                        </Button>
                    </form>
                    {message && (
                        <p className="text-sm text-center text-muted-foreground mt-2">{message}</p>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-sm text-muted-foreground text-center">
                        <Link to="/" className="hover:underline">
                            Back to Home
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
