import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// Auto-load all API routes from the api/ directory
const loadRoutes = async () => {
    const apiDir = path.join(__dirname, 'api');
    if (fs.existsSync(apiDir)) {
        const files = fs.readdirSync(apiDir).filter(file => file.endsWith('.js'));

        for (const file of files) {
            const routeName = file.replace('.js', '');
            try {
                const modulePath = "file://" + path.join(apiDir, file);
                const routeModule = await import(modulePath);
                if (routeModule.default) {
                    app.all(`/api/${routeName}`, routeModule.default);
                    console.log(`Loaded API route: /api/${routeName}`);
                }
            } catch (err) {
                console.error(`Failed to load route ${file}:`, err);
            }
        }
    }
};

app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

loadRoutes().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
