import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Check } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";

export const NewsletterSignup = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await pb.collection('newsletter_subscribers').create({
                email,
                active: true
            });
            setSuccess(true);
            toast.success("Inscrito com sucesso!");
            setEmail("");
        } catch (error: any) {
            if (error.status === 400) {
                toast.error("Email já cadastrado.");
            } else {
                toast.error("Erro ao inscrever-se.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 p-4 rounded-xl border border-green-400/20">
                <Check className="h-5 w-5" />
                <span>Obrigado por se inscrever!</span>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-2">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
                Receba novidades sobre fotografia, design e dicas exclusivas.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="email"
                    placeholder="Seu melhor email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-electric-blue/50 text-white"
                    required
                />
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-electric-blue hover:bg-electric-blue/80 text-white"
                >
                    {loading ? "..." : <Send className="h-4 w-4" />}
                </Button>
            </form>
        </div>
    );
};
