import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import ColorThief from 'colorthief';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import { extractExifDataWithAI, ExifDataWithAI } from '@/lib/exifExtractor';
import { Loader2, Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ProcessedImage {
    file: File;
    preview: string;
    exif: ExifDataWithAI;
    dominantColor: string; // Hex color
    palette: string[]; // Array of hex colors
    originalSize: number;
    compressedSize: number;
    classifications: { className: string; probability: number }[];
}

interface ImageUploadProps {
    onImageProcessed: (data: ProcessedImage) => void;
    className?: string;
    maxSizeMB?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageProcessed,
    className,
    maxSizeMB = 2
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const rgbToHex = (r: number, g: number, b: number) =>
        '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');

    const processImage = async (file: File) => {
        setIsProcessing(true);
        setProgress(10);
        setError(null);

        try {
            // 1. Create Preview
            const preview = URL.createObjectURL(file);
            setProgress(30);

            // 2. Extract EXIF
            const exif = await extractExifDataWithAI(file);
            setProgress(50);

            // 3. Compress Image
            const options = {
                maxSizeMB: maxSizeMB,
                maxWidthOrHeight: 2560, // 2.5k resolution limit for web
                useWebWorker: true,
                onProgress: (p: number) => setProgress(50 + (p / 2)) // 50-100%
            };

            let compressedFile = file;
            try {
                compressedFile = await imageCompression(file, options);
            } catch (e) {
                console.warn("Compression failed, using original file", e);
            }

            // 4. Extract Colors
            let dominantColor = '#000000';
            let palette: string[] = [];

            try {
                const img = new Image();
                img.src = preview;
                await new Promise((resolve) => { img.onload = resolve; });

                const colorThief = new ColorThief();
                const color = colorThief.getColor(img);
                const paletteRaw = colorThief.getPalette(img, 5);

                dominantColor = rgbToHex(color[0], color[1], color[2]);
                palette = paletteRaw.map((c: number[]) => rgbToHex(c[0], c[1], c[2]));
            } catch (e) {
                console.warn("Color extraction failed", e);
            }

            // 5. AI Classification (MobileNet)
            let classifications: { className: string; probability: number }[] = [];
            try {
                const img = new Image();
                img.src = preview;
                await new Promise((resolve) => { img.onload = resolve; });

                // Load model (this downloads the model, might take a few seconds on first run)
                // In production, we should load this once outside or use a context
                const model = await mobilenet.load();
                classifications = await model.classify(img);
            } catch (e) {
                console.warn("Classification failed", e);
            }

            const result: ProcessedImage = {
                file: compressedFile,
                preview,
                exif,
                dominantColor,
                palette,
                originalSize: file.size,
                compressedSize: compressedFile.size,
                classifications
            };

            onImageProcessed(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to process image");
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            processImage(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1,
        disabled: isProcessing
    });

    return (
        <div className={cn("w-full", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative overflow-hidden",
                    isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50",
                    isProcessing && "pointer-events-none opacity-80",
                    error && "border-destructive/50 bg-destructive/5"
                )}
            >
                <input {...getInputProps()} />

                {isProcessing ? (
                    <div className="flex flex-col items-center justify-center py-4 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <div className="w-full max-w-xs space-y-2">
                            <p className="text-sm text-muted-foreground">Optimizing image & extracting AI data...</p>
                            <Progress value={progress} className="h-2" />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                        <div className="p-4 bg-secondary rounded-full">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-medium">
                                {isDragActive ? "Drop the image here" : "Drag & drop or click to upload"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Supports JPG, PNG, WebP (Max {maxSizeMB}MB optimized)
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-1 rounded-full">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
