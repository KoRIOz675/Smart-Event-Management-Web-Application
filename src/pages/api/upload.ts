import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

export const config = {
    api: { bodyParser: { sizeLimit: '7mb' } },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

const MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/avif': '.avif',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { image } = req.body as { image?: string };

    if (!image || !image.startsWith('data:image/')) {
        return res.status(400).json({ message: "Fichier image manquant ou invalide." });
    }

    const [header, base64] = image.split(',');
    const mime = header.match(/data:([^;]+);/)?.[1] ?? '';
    const ext = MIME_TO_EXT[mime] ?? '.jpg';

    if (!MIME_TO_EXT[mime]) {
        return res.status(400).json({ message: "Format d'image non supporté." });
    }

    const buffer = Buffer.from(base64, 'base64');
    if (buffer.byteLength > 5 * 1024 * 1024) {
        return res.status(413).json({ message: "L'image dépasse la limite de 5 Mo." });
    }

    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = `${randomUUID()}${ext}`;
        fs.writeFileSync(path.join(uploadDir, filename), buffer);

        return res.status(200).json({ url: `/uploads/${filename}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de l'enregistrement de l'image." });
    }
}
