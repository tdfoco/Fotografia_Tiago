import { useEffect } from 'react';

export const useImageProtection = () => {
    useEffect(() => {
        // Prevent right-click context menu
        const handleContextMenu = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG' || target.closest('img')) {
                e.preventDefault();
                return false;
            }
        };

        // Prevent drag and drop
        const handleDragStart = (e: DragEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
                e.preventDefault();
                return false;
            }
        };

        // Prevent keyboard shortcuts for saving images
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent Ctrl+S, Ctrl+Shift+S (Save)
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                const target = e.target as HTMLElement;
                if (target.tagName === 'IMG' || document.activeElement?.tagName === 'IMG') {
                    e.preventDefault();
                    return false;
                }
            }

            // Prevent Print Screen in some browsers
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                // Show a message (optional)
                console.log('Screenshots are disabled for image protection');
                return false;
            }
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('dragstart', handleDragStart);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
};
