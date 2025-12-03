import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Calculator, Mail } from 'lucide-react';

const BudgetCalculator = () => {
    const [serviceType, setServiceType] = useState('photography');
    const [hours, setHours] = useState(2);
    const [photoCount, setPhotoCount] = useState(50);
    const [editing, setEditing] = useState(false);
    const [travel, setTravel] = useState(0);

    const calculatePrice = () => {
        let basePrice = 0;

        if (serviceType === 'photography') {
            basePrice = 500 + (hours * 150);
            if (photoCount > 50) {
                basePrice += ((photoCount - 50) / 10) * 50;
            }
        } else {
            // Design gráfico
            basePrice = 300 + (hours * 100);
            if (editing) {
                basePrice += 200;
            }
        }

        basePrice += travel;

        return Math.round(basePrice);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border-primary/20">
            <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Calculator className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-display">Calculadora de Orçamento</CardTitle>
                <CardDescription>
                    Obtenha uma estimativa instantânea do valor do seu projeto.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Tipo de Serviço</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="photography">Fotografia</SelectItem>
                            <SelectItem value="design">Design Gráfico</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Horas Estimadas: {hours}h</Label>
                    <Slider
                        value={[hours]}
                        onValueChange={(val) => setHours(val[0])}
                        min={1}
                        max={12}
                        step={0.5}
                        className="py-4"
                    />
                </div>

                {serviceType === 'photography' && (
                    <div className="space-y-2">
                        <Label>Quantidade de Fotos Editadas: {photoCount}</Label>
                        <Slider
                            value={[photoCount]}
                            onValueChange={(val) => setPhotoCount(val[0])}
                            min={20}
                            max={200}
                            step={10}
                            className="py-4"
                        />
                    </div>
                )}

                {serviceType === 'design' && (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="editing"
                            checked={editing}
                            onChange={(e) => setEditing(e.target.checked)}
                            className="rounded"
                        />
                        <Label htmlFor="editing">Inclui Edição e Revisões (+R$ 200)</Label>
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Deslocamento (km): {travel}km</Label>
                    <Slider
                        value={[travel]}
                        onValueChange={(val) => setTravel(val[0])}
                        min={0}
                        max={200}
                        step={10}
                        className="py-4"
                    />
                    <p className="text-xs text-muted-foreground">
                        R$ 2/km a partir de 20km
                    </p>
                </div>

                <div className="border-t pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-medium">Estimativa:</span>
                        <span className="text-3xl font-bold text-primary">
                            R$ {calculatePrice().toLocaleString('pt-BR')}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                        *Valor aproximado. O orçamento final pode variar conforme especificações do projeto.
                    </p>
                    <Button className="w-full" size="lg" asChild>
                        <a href="/contact">
                            <Mail className="mr-2 h-4 w-4" />
                            Solicitar Orçamento Detalhado
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default BudgetCalculator;
