import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    className?: string;
}

const TagInput = ({ tags, onChange, placeholder = "Add tags (press Enter)", className = "" }: TagInputProps) => {
    const [inputValue, setInputValue] = useState('');

    const normalizeTag = (tag: string): string => {
        return tag.trim().toLowerCase().replace(/\s+/g, '_');
    };

    const addTag = (tag: string) => {
        const normalized = normalizeTag(tag);
        if (normalized && !tags.includes(normalized)) {
            onChange([...tags, normalized]);
        }
        setInputValue('');
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // Remove last tag when backspace is pressed on empty input
            removeTag(tags[tags.length - 1]);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');

        // Support comma-separated tags
        const newTags = pastedText
            .split(/[,;\n]/)
            .map(normalizeTag)
            .filter(tag => tag && !tags.includes(tag));

        onChange([...tags, ...newTags]);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={placeholder}
                className="w-full"
            />

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="px-3 py-1 flex items-center gap-1 text-sm"
                        >
                            <span>#{tag}</span>
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive transition-colors"
                                aria-label={`Remove ${tag} tag`}
                            >
                                <X size={14} />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                Press Enter to add tags. Paste comma-separated tags for batch input.
            </p>
        </div>
    );
};

export default TagInput;
