// import des modules
import axios from "axios";
import * as cheerio from "cheerio";
import { Element } from "domhandler";

// Variables globales
const url = "https://www.tractorpool.com/used/a-Tractors/24/b-Tractors/95/";
const tractorData: Tractor[] = [];
let pageIndex = 0;

// Interface pour les données des tracteurs
interface Tractor {
    TractorID: string;
    classification: string;
    name: string;
}

// Configuration des en-têtes
const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': 'https://www.tractorpool.com',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
};

// Fonction pour formater le nom du tracteur
function formatTractorName(rawName: string): string{
    return rawName
        .replace(/\n/g, '')
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .filter(word => word.length > 0)
        .join(' ')
        .replace(/\+$/, '-');
}

// export du scrapping de la liste des tracteurs
export async function getTractors(pageUrl: string = url): Promise<Tractor[]> {
    try {
        const response = await axios.get(pageUrl, { headers });
        const $ = cheerio.load(response.data);
        const tractors = $('div[data-machine]');
        const nextButton = $('a.text-gray-extradeep[href*="page="]');
        
        tractors.each(function(this: Element, _index: number, element: Element) {
            const TractorID = $(element).attr('data-machine') || '';
            const rawName = $(element).find('h2').text();
            const name = formatTractorName(rawName);

            // Récupération de la classification dans l'URL
            const link = $(element).find('a').attr('href') || '';
            let classification = '';
            if (link) {
                const match = link.match(/Tractors\/(.*?)\/\d+/);
                classification = match ? match[1] : '';
            }
            tractorData.push({  TractorID, classification, name });
        });

        if (nextButton.length > 0 && pageIndex < 4) {
            pageIndex++;
            const nextPageUrl = nextButton.attr('href') || '';
            if (nextPageUrl) {
                await getTractors(nextPageUrl);
            }
        }
        return tractorData;

    }
    catch (error) { 
        console.error("Erreur lors de la récupération des tracteurs :", error);
        return [];
    }
}