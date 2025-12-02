import type { ExifData } from './exifExtractor';

/**
 * AI Helpers Library
 * Funções utilitárias para automação inteligente de conteúdo
 */

// ==========================================
// 1. GERAÇÃO DE ALT TEXT A PARTIR DO EXIF
// ==========================================

export function generateAltTextFromEXIF(
  exifData: ExifData,
  title?: string,
  category?: string
): string {
  const parts: string[] = [];

  // Adicionar título se disponível
  if (title) {
    parts.push(title);
  }

  // Adicionar categoria contextual
  const categoryContext = getCategoryContext(category);
  if (categoryContext) {
    parts.push(categoryContext);
  }

  // Adicionar informações técnicas relevantes
  const technicalInfo: string[] = [];
  if (exifData.camera_model) {
    technicalInfo.push(`fotografado com ${exifData.camera_model}`);
  }
  if (exifData.lens_model) {
    technicalInfo.push(`usando ${exifData.lens_model}`);
  }

  if (technicalInfo.length > 0) {
    parts.push(technicalInfo.join(', '));
  }

  // Se não temos informação suficiente, usar template padrão
  if (parts.length === 0) {
    return 'Fotografia profissional de Tiago Damasceno';
  }

  return parts.join(' - ');
}

// ==========================================
// 2. GERAÇÃO DE META TAGS SEO
// ==========================================

export interface SEOMetaTags {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  twitterCard: 'summary' | 'summary_large_image';
}

export function generateSEOMetaTags(
  title: string,
  description?: string,
  category?: string,
  exifData?: ExifData,
  type: 'photography' | 'design' = 'photography'
): SEOMetaTags {
  // Título otimizado para SEO
  const seoTitle = `${title} | ${category ? formatCategory(category) : 'Portfólio'} - Tiago Damasceno`;

  // Descrição otimizada
  let seoDescription = description || '';
  
  if (!seoDescription && exifData) {
    seoDescription = generateDescriptionFromEXIF(title, exifData, category);
  }

  if (!seoDescription) {
    seoDescription = type === 'photography'
      ? `Fotografia profissional: ${title}. Explore mais trabalhos de fotografia no portfólio de Tiago Damasceno.`
      : `Projeto de design gráfico: ${title}. Veja mais projetos criativos no portfólio de Tiago Damasceno.`;
  }

  // Keywords baseadas em contexto
  const keywords = generateKeywords(title, category, exifData, type);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords,
    ogTitle: title,
    ogDescription: seoDescription,
    twitterCard: 'summary_large_image',
  };
}

// ==========================================
// 3. SUGESTÃO DE TAGS
// ==========================================

export function suggestTags(
  title: string,
  description?: string,
  category?: string,
  exifData?: ExifData
): string[] {
  const tags = new Set<string>();

  // Tags baseadas em categoria
  if (category) {
    tags.add(category);
    const relatedTags = getCategoryRelatedTags(category);
    relatedTags.forEach(tag => tags.add(tag));
  }

  // Tags baseadas em palavras-chave do título
  const titleWords = extractKeywords(title);
  titleWords.forEach(word => tags.add(word));

  // Tags baseadas em descrição
  if (description) {
    const descWords = extractKeywords(description);
    descWords.slice(0, 3).forEach(word => tags.add(word));
  }

  // Tags técnicas baseadas em EXIF
  if (exifData) {
    if (exifData.camera_make) {
      tags.add(exifData.camera_make.toLowerCase());
    }
    
    // Tags de tipo de fotografia baseada em configurações
    if (exifData.aperture && parseFloat(exifData.aperture.replace('f/', '')) <= 2.8) {
      tags.add('bokeh');
      tags.add('profundidade de campo');
    }

    if (exifData.iso && exifData.iso >= 1600) {
      tags.add('low light');
      tags.add('noite');
    }

    if (exifData.shutter_speed && exifData.shutter_speed.includes('1/')) {
      const speed = parseInt(exifData.shutter_speed.split('/')[1]);
      if (speed >= 500) {
        tags.add('ação');
        tags.add('movimento');
      }
    }
  }

  // Limitar a 10 tags mais relevantes
  return Array.from(tags).slice(0, 10);
}

// ==========================================
// 4. GERAÇÃO DE DESCRIÇÕES AUTOMÁTICAS
// ==========================================

export function generateDescription(
  title: string,
  exifData?: ExifData,
  category?: string
): string {
  if (exifData) {
    return generateDescriptionFromEXIF(title, exifData, category);
  }

  // Descrição genérica baseada em categoria
  const categoryDesc = getCategoryDescription(category);
  return `${title}. ${categoryDesc}`;
}

function generateDescriptionFromEXIF(
  title: string,
  exifData: ExifData,
  category?: string
): string {
  const parts: string[] = [title];

  // Adicionar contexto de categoria
  const categoryContext = getCategoryDescription(category);
  if (categoryContext) {
    parts.push(categoryContext);
  }

  // Informações técnicas interessantes
  const technical: string[] = [];
  
  if (exifData.camera_model) {
    technical.push(`Capturado com ${exifData.camera_model}`);
  }

  if (exifData.lens_model) {
    technical.push(`utilizando ${exifData.lens_model}`);
  }

  // Configurações destacáveis
  const settings: string[] = [];
  if (exifData.aperture) settings.push(exifData.aperture);
  if (exifData.shutter_speed) settings.push(exifData.shutter_speed);
  if (exifData.iso) settings.push(`ISO ${exifData.iso}`);

  if (settings.length > 0) {
    technical.push(`Configurações: ${settings.join(', ')}`);
  }

  if (technical.length > 0) {
    parts.push(technical.join('. ') + '.');
  }

  return parts.join(' ');
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function getCategoryContext(category?: string): string {
  const contexts: Record<string, string> = {
    'portraits': 'Retrato profissional',
    'urban': 'Fotografia urbana',
    'nature': 'Fotografia de natureza',
    'art': 'Fotografia artística',
    'events': 'Fotografia de eventos',
    'logos': 'Design de logotipo',
    'visual_identity': 'Identidade visual',
    'social_media': 'Design para redes sociais',
    'posters': 'Design de poster',
    'special': 'Projeto especial',
  };

  return category ? (contexts[category] || '') : '';
}

function getCategoryDescription(category?: string): string {
  const descriptions: Record<string, string> = {
    'portraits': 'Retrato profissional que captura a essência e personalidade do modelo.',
    'urban': 'Fotografia urbana explorando arquitetura, texturas e vida na cidade.',
    'nature': 'Fotografia de natureza celebrando a beleza do ambiente natural.',
    'art': 'Projeto artístico experimental explorando conceitos visuais únicos.',
    'events': 'Cobertura fotográfica de evento, capturando momentos importantes.',
    'logos': 'Design de logotipo profissional com identidade visual marcante.',
    'visual_identity': 'Projeto completo de identidade visual para marca.',
    'social_media': 'Design otimizado para engajamento em redes sociais.',
    'posters': 'Design de poster com comunicação visual impactante.',
    'special': 'Projeto especial desenvolvido com conceito criativo único.',
  };

  return category ? (descriptions[category] || 'Trabalho profissional de alta qualidade.') : 'Trabalho profissional de alta qualidade.';
}

function formatCategory(category: string): string {
  const formatted: Record<string, string> = {
    'portraits': 'Retratos',
    'urban': 'Urbano',
    'nature': 'Natureza',
    'art': 'Arte',
    'events': 'Eventos',
    'logos': 'Logos',
    'visual_identity': 'Identidade Visual',
    'social_media': 'Social Media',
    'posters': 'Posters',
    'special': 'Especiais',
  };

  return formatted[category] || category;
}

function getCategoryRelatedTags(category: string): string[] {
  const relatedTags: Record<string, string[]> = {
    'portraits': ['retrato', 'pessoas', 'estúdio', 'modelo'],
    'urban': ['cidade', 'arquitetura', 'urbano', 'street'],
    'nature': ['paisagem', 'natureza', 'outdoor', 'ambiente'],
    'art': ['arte', 'experimental', 'conceitual', 'criativo'],
    'events': ['evento', 'cobertura', 'social', 'festa'],
    'logos': ['logo', 'marca', 'branding', 'design'],
    'visual_identity': ['identidade', 'branding', 'marca', 'corporativo'],
    'social_media': ['social', 'digital', 'marketing', 'post'],
    'posters': ['poster', 'gráfico', 'impresso', 'publicidade'],
    'special': ['especial', 'único', 'exclusivo', 'customizado'],
  };

  return relatedTags[category] || [];
}

function extractKeywords(text: string): string[] {
  // Palavras a ignorar (stop words em português)
  const stopWords = new Set([
    'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'dos', 'das',
    'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 'sem',
    'e', 'ou', 'mas', 'que', 'quando', 'onde', 'como', 'este', 'esse'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\sáàâãéèêíïóôõöúçñ]/g, '') // Mantém acentos
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
    .filter((word, index, self) => self.indexOf(word) === index) // Único
    .slice(0, 5);
}

function generateKeywords(
  title: string,
  category?: string,
  exifData?: ExifData,
  type: 'photography' | 'design' = 'photography'
): string[] {
  const keywords = new Set<string>();

  // Keywords base
  keywords.add('Tiago Damasceno');
  keywords.add(type === 'photography' ? 'fotografia' : 'design gráfico');
  keywords.add('portfólio');

  // Adicionar categoria
  if (category) {
    keywords.add(formatCategory(category));
  }

  // Palavras-chave do título
  const titleKeywords = extractKeywords(title);
  titleKeywords.forEach(kw => keywords.add(kw));

  // Keywords técnicas de fotografia
  if (type === 'photography' && exifData) {
    if (exifData.camera_make) {
      keywords.add(`fotografia ${exifData.camera_make}`);
    }
  }

  return Array.from(keywords);
}

// ==========================================
// 5. ANÁLISE DE SENTIMENTO SIMPLES
// ==========================================

export interface SentimentAnalysis {
  score: number; // -1 (negativo) a 1 (positivo)
  category: 'positive' | 'neutral' | 'negative';
  confidence: number; // 0 a 1
}

export function analyzeSentiment(text: string): SentimentAnalysis {
  const positiveWords = [
    'excelente', 'incrível', 'maravilhoso', 'lindo', 'perfeito', 'ótimo',
    'fantástico', 'espetacular', 'brilhante', 'talentoso', 'impressionante',
    'amor', 'amei', 'adorei', 'parabéns', 'sensacional'
  ];

  const negativeWords = [
    'ruim', 'péssimo', 'horrível', 'feio', 'terrível', 'pior',
    'ódio', 'odiei', 'detestei', 'fraco', 'decepção', 'decepcionante'
  ];

  const lowerText = text.toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    positiveCount += (lowerText.match(regex) || []).length;
  });

  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    negativeCount += (lowerText.match(regex) || []).length;
  });

  const totalWords = lowerText.split(/\s+/).length;
  const sentimentWords = positiveCount + negativeCount;
  
  // Score de -1 a 1
  const score = sentimentWords === 0 
    ? 0 
    : (positiveCount - negativeCount) / Math.max(1, sentimentWords);

  // Confiança baseada em proporção de palavras de sentimento
  const confidence = Math.min(sentimentWords / Math.max(1, totalWords / 5), 1);

  let category: 'positive' | 'neutral' | 'negative';
  if (score > 0.2) category = 'positive';
  else if (score < -0.2) category = 'negative';
  else category = 'neutral';

  return { score, category, confidence };
}
