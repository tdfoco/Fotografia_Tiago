import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Camera, Palette, Lightbulb, ArrowRight, ArrowLeft, Check, Calendar, DollarSign } from "lucide-react";
import { emailService } from "@/lib/integrations/email";
import { toast } from "sonner";

const steps = [
    { id: 1, title: "Serviço" },
    { id: 2, title: "Detalhes" },
    { id: 3, title: "Contato" },
    { id: 4, title: "Revisão" }
];

const services = [
    { id: "photography", title: "Fotografia", icon: Camera, desc: "Ensaios, Eventos, Comercial" },
    { id: "design", title: "Design Gráfico", icon: Palette, desc: "Identidade Visual, Branding" },
    { id: "consulting", title: "Consultoria", icon: Lightbulb, desc: "Direção Criativa, Mentoria" }
];

const budgets = [
    { id: "low", label: "Até R$ 1.000" },
    { id: "medium", label: "R$ 1.000 - R$ 5.000" },
    { id: "high", label: "R$ 5.000 - R$ 10.000" },
    { id: "premium", label: "Acima de R$ 10.000" }
];

export const MultiStepContact = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        service: "",
        date: "",
        budget: "",
        description: "",
        name: "",
        email: "",
        phone: ""
    });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await emailService.send({
                name: formData.name,
                email: formData.email,
                service: formData.service,
                message: `
                    Serviço: ${formData.service}
                    Data Desejada: ${formData.date}
                    Orçamento: ${formData.budget}
                    Telefone: ${formData.phone}
                    
                    Descrição:
                    ${formData.description}
                `
            });
            toast.success("Mensagem enviada com sucesso!");
            // Reset or redirect
            setCurrentStep(1);
            setFormData({
                service: "",
                date: "",
                budget: "",
                description: "",
                name: "",
                email: "",
                phone: ""
            });
        } catch (error) {
            toast.error("Erro ao enviar mensagem.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1: return !!formData.service;
            case 2: return !!formData.description && !!formData.budget;
            case 3: return !!formData.name && !!formData.email;
            default: return true;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-secondary/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            {/* Progress Bar */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${currentStep >= step.id
                                    ? "bg-electric-blue text-white shadow-[0_0_10px_rgba(58,139,253,0.5)]"
                                    : "bg-secondary/50 text-gray-500 border border-white/10"
                                }`}
                        >
                            {currentStep > step.id ? <Check size={16} /> : step.id}
                        </div>
                        <span className={`text-xs font-medium ${currentStep >= step.id ? "text-white" : "text-gray-500"}`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white mb-4">Qual serviço você procura?</h3>
                            <div className="grid gap-4">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => setFormData({ ...formData, service: service.id })}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${formData.service === service.id
                                                ? "bg-electric-blue/20 border-electric-blue shadow-[0_0_15px_rgba(58,139,253,0.2)]"
                                                : "bg-secondary/20 border-white/5 hover:border-white/20 hover:bg-secondary/30"
                                            }`}
                                    >
                                        <div className={`p-3 rounded-full ${formData.service === service.id ? "bg-electric-blue text-white" : "bg-white/5 text-gray-400"}`}>
                                            <service.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{service.title}</h4>
                                            <p className="text-sm text-gray-400">{service.desc}</p>
                                        </div>
                                        {formData.service === service.id && <Check className="ml-auto text-electric-blue" />}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white mb-4">Detalhes do Projeto</h3>

                            <div className="space-y-4">
                                <div>
                                    <Label className="mb-2 block">Orçamento Estimado</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {budgets.map((b) => (
                                            <div
                                                key={b.id}
                                                onClick={() => setFormData({ ...formData, budget: b.label })}
                                                className={`p-3 rounded-lg border cursor-pointer text-sm text-center transition-all ${formData.budget === b.label
                                                        ? "bg-electric-blue/20 border-electric-blue text-white"
                                                        : "bg-secondary/20 border-white/5 text-gray-400 hover:bg-secondary/30"
                                                    }`}
                                            >
                                                {b.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="mb-2 block">Data Desejada (Opcional)</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="pl-10 bg-secondary/20 border-white/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="mb-2 block">Descrição do Projeto</Label>
                                    <Textarea
                                        placeholder="Conte um pouco sobre sua ideia..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="bg-secondary/20 border-white/10 h-32"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white mb-4">Seus Dados</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nome Completo</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-secondary/20 border-white/10"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-secondary/20 border-white/10"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Telefone / WhatsApp</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="bg-secondary/20 border-white/10"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white mb-4">Revisão</h3>
                            <div className="bg-secondary/20 rounded-xl p-6 space-y-4 border border-white/5">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Serviço:</span>
                                    <span className="text-white font-medium capitalize">{formData.service}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Orçamento:</span>
                                    <span className="text-white font-medium">{formData.budget}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Nome:</span>
                                    <span className="text-white font-medium">{formData.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400">Email:</span>
                                    <span className="text-white font-medium">{formData.email}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-1">Descrição:</span>
                                    <p className="text-white text-sm bg-black/20 p-3 rounded-lg">{formData.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>

                {currentStep < 4 ? (
                    <Button
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className="bg-electric-blue hover:bg-electric-blue/80 text-white"
                    >
                        Próximo <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                        {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                        {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                    </Button>
                )}
            </div>
        </div>
    );
};

import { Send } from "lucide-react";
