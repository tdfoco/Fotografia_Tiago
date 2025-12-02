import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Twitter } from 'lucide-react';
import type { SEOMetaTags } from '@/lib/aiHelpers';

interface SEOPreviewProps {
    metaTags: SEOMetaTags;
    imageUrl?: string;
}

const SEOPreview = ({ metaTags, imageUrl }: SEOPreviewProps) => {
    return (
        <div className="space-y-4">
            {/* Google Search Preview */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-blue-600" />
                        <CardTitle className="text-sm">Preview Google Search</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1 font-sans">
                        <div className="text-xs text-green-700">
                            tdfoco.cloud › fotografia
                        </div>
                        <div className="text-xl text-blue-600 hover:underline cursor-pointer">
                            {metaTags.title}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                            {metaTags.description}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Open Graph / Facebook Preview */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <CardTitle className="text-sm">Preview Facebook / LinkedIn</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden bg-white">
                        {imageUrl && (
                            <div className="aspect-video bg-gray-100 relative">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="p-3 space-y-1">
                            <div className="text-xs text-gray-500 uppercase">
                                tdfoco.cloud
                            </div>
                            <div className="font-semibold text-gray-900 line-clamp-1">
                                {metaTags.ogTitle}
                            </div>
                            <div className="text-sm text-gray-600 line-clamp-2">
                                {metaTags.ogDescription}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Twitter Card Preview */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                        <Twitter className="w-4 h-4 text-blue-400" />
                        <CardTitle className="text-sm">Preview Twitter Card</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-xl overflow-hidden bg-white max-w-md">
                        {imageUrl && (
                            <div className="aspect-video bg-gray-100 relative">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="p-3 space-y-1">
                            <div className="font-semibold text-gray-900 line-clamp-1">
                                {metaTags.ogTitle}
                            </div>
                            <div className="text-sm text-gray-600 line-clamp-2">
                                {metaTags.ogDescription}
                            </div>
                            <div className="text-xs text-gray-500">
                                tdfoco.cloud
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Keywords */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Keywords SEO</CardTitle>
                    <CardDescription>
                        Palavras-chave para otimização
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {metaTags.keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {keyword}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SEOPreview;
