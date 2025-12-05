/**
 * StructuredData Component - Adiciona Schema.org JSON-LD ao head
 */

import { useEffect } from 'react';

interface StructuredDataProps {
    data: object | object[];
}

const StructuredData = ({ data }: StructuredDataProps) => {
    useEffect(() => {
        const dataArray = Array.isArray(data) ? data : [data];
        const scriptIds: string[] = [];

        dataArray.forEach((schemaData, index) => {
            const scriptId = `structured-data-${index}-${Date.now()}`;
            scriptIds.push(scriptId);

            const script = document.createElement('script');
            script.id = scriptId;
            script.type = 'application/ld+json';
            script.text = JSON.stringify(schemaData);
            document.head.appendChild(script);
        });

        // Cleanup on unmount
        return () => {
            scriptIds.forEach(id => {
                const existingScript = document.getElementById(id);
                if (existingScript) {
                    document.head.removeChild(existingScript);
                }
            });
        };
    }, [data]);

    return null; // Component doesn't render anything
};

export default StructuredData;
