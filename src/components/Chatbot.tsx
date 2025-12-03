import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Olá! Sou o assistente virtual do Tiago. Como posso ajudar você hoje?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Simple rule-based response
        setTimeout(() => {
            const lowerText = userMsg.text.toLowerCase();
            let responseText = "Desculpe, não entendi. Pode reformular ou entrar em contato pelo formulário?";

            if (lowerText.includes('preço') || lowerText.includes('valor') || lowerText.includes('orçamento')) {
                responseText = "Nossos pacotes de fotografia começam a partir de R$ 500. Para um orçamento detalhado, por favor use nossa calculadora na página de Serviços ou entre em contato.";
            } else if (lowerText.includes('serviço') || lowerText.includes('faz')) {
                responseText = "Oferecemos serviços de Fotografia (Retratos, Eventos, Urbana) e Design Gráfico (Identidade Visual, Logos, Social Media).";
            } else if (lowerText.includes('contato') || lowerText.includes('email') || lowerText.includes('telefone')) {
                responseText = "Você pode entrar em contato pelo email contato@tdfoco.cloud ou pelo formulário na página de Contato.";
            } else if (lowerText.includes('oi') || lowerText.includes('olá')) {
                responseText = "Olá! Tudo bem? Em que posso ajudar?";
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 transition-all hover:scale-110"
                >
                    <MessageCircle className="h-8 w-8" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-80 h-96 flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <CardHeader className="p-3 border-b bg-primary/5 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            <CardTitle className="text-sm font-medium">Assistente Virtual</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full p-4">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.sender === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : 'bg-muted text-foreground rounded-tl-none'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-3 border-t bg-background">
                        <div className="flex w-full gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 h-9 text-sm"
                            />
                            <Button size="icon" className="h-9 w-9" onClick={handleSend}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default Chatbot;
