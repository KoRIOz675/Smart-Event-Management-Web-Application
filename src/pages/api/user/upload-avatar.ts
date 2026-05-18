import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// Note: We remove the `bodyParser: false` config because we
// WANT Next.js to parse the incoming JSON body!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    // The frontend sends: { userId: "...", base64: "...", ext: "jpg" }
    const { userId, base64, ext } = req.body;

    if (!userId || !base64) {
        return res.status(400).json({ message: 'Missing userId or image data' });
    }

    try {
        const uploadDir = path.join(process.cwd(), 'public', 'profile_pictures');

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const newFilename = `${userId}.${ext || 'jpg'}`;
        const newPath = path.join(uploadDir, newFilename);

        // Convert the base64 string back into a binary image file
        const imageBuffer = Buffer.from(base64, 'base64');

        // Write the file to the disk
        fs.writeFileSync(newPath, imageBuffer);

        // Update the database with the new image URL
        const imageUrl = `/profile_pictures/${newFilename}`;
        await db.update(users).set({ imageUrl }).where(eq(users.id, userId));

        return res.status(200).json({ imageUrl });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ message: 'Upload failed' });
    }
}