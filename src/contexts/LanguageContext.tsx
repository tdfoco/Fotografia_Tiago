import React, { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import ptTranslations from './translations/pt.json';
import enTranslations from './translations/en.json';
import esTranslations from './translations/es.json';
import frTranslations from './translations/fr.json';

type Language = 'pt' | 'en' | 'es' | 'fr';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => any;
}

const localTranslations = {
    pt: ptTranslations,
    en: enTranslations,
    es: esTranslations,
    fr: frTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

interface LanguageProviderProps {
    children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'pt';
    });
    const [dbTranslations, setDbTranslations] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const data = await pb.collection('site_content').getFullList({
                    filter: `lang="${language}"`,
                });

                if (data) {
                    const translationsMap = data.reduce((acc: any, item: any) => {
                        acc[item.key] = item.value;
                        return acc;
                    }, {} as Record<string, string>);
                    setDbTranslations(translationsMap);
                }
            } catch (error) {
                console.error('Error fetching translations:', error);
            }
        };

        fetchTranslations();

        // Subscribe to changes
        pb.collection('site_content').subscribe('*', (e) => {
            if (e.record.lang === language) {
                fetchTranslations();
            }
        });

        return () => {
            pb.collection('site_content').unsubscribe('*');
        };
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string): any => {
        // First check database translations
        if (dbTranslations[key]) {
            return dbTranslations[key];
        }

        // Fallback to local JSON
        const currentTranslations = localTranslations[language];
        const keys = key.split('.');
        let value: any = currentTranslations;

        for (const k of keys) {
            value = value?.[k];
        }

        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
