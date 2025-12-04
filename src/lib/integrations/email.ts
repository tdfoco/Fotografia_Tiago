import { pb } from "@/lib/pocketbase";

export interface ContactMessage {
    name: string;
    email: string;
    service: string;
    message: string;
}

export const emailService = {
    async send(data: ContactMessage) {
        try {
            // 1. Save to PocketBase 'messages' collection
            await pb.collection('messages').create({
                ...data,
                status: 'new',
                read: false
            });

            // 2. (Future) Trigger cloud function or external API to send actual email
            // await fetch('/api/send-email', { method: 'POST', body: JSON.stringify(data) });

            return { success: true };
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
};
