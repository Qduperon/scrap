import express from 'express';
import cors from 'cors';
import { getTractors } from './tractor';
import { getDetails } from './details';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route pour obtenir la liste des tracteurs
app.get('/tractors', async (_req, res) => {
    try {
        const tractors = await getTractors();
        res.json(tractors);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des tracteurs' });
    }
});

// Route pour obtenir les détails d'un tracteur spécifique
app.get('/tractor/:classification/:id', async (req, res) => {
    try {
        const { id, classification } = req.params;
        const details = await getDetails( classification, id);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des détails du tracteur' });
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`API en cours d'exécution sur http://localhost:${port}`);
});