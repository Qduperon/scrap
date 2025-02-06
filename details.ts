// import des modules
import axios from "axios";
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import { Element } from "domhandler";

// Variables globales
const BASE_URL = "https://www.tractorpool.com/details/Tractors/";

// Interface pour les détails du tracteur
interface TractorDetails {
    advert : number;
    hours : number;
    price : number;
    year : number;
    advertiserStatut : string;
    condition : string;
    description : string;
    location : string;
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

// Déclaration des variables
const details : TractorDetails = {
    advert : 0,
    price : 0,
    hours : 0,
    year : 0,
    advertiserStatut : "",
    condition : "",
    description : "",
    location : "",
}

// Fonction pour afficher les détails
/*function printDetails(details: TractorDetails) {
    console.log("Details du tracteur :");
    console.log("---------------------");
    console.log('Prix : '+ '$' + details.price);
    console.log('Location : ' + details.location);
    console.log('Condition : ' + details.condition);
    console.log('Advertiser status : ' + details.advertiserStatut);
    console.log('Year of manufacture : ' + details.year);
    console.log('Operating hours : ' + details.hours); 
    console.log('Advert number : ' + details.advert);
    console.log("---------------------");
    console.log('Description : ');
    console.log(details.description);
}*/

// Fonction pour récupérer un détail spécifique
async function getSpecificDetails($ : CheerioAPI, label: string) : Promise<string | number> {
    try {

        // Trouver la cellule qui contient "le label"
        const Cell = $('td.font-bold').filter(function(this: Element) {
            return $(this).text().trim() === label;
        });
        
        if (label === "Location") {
            const location = Cell
            .next('td')
            .find('span')
            .first()
            .text()
            .trim();
            return location;    
        }
        else {
        const detail = Cell
        .next('td')
        .first()
        .text()
        .trim();

        return detail;
        }
    }
    catch (error) { 
        console.error("Erreur lors de la récupération de " + label + " du tracteur :", error);
        console.log(error);
        return "";
    }
}

// export du scrapping pour récupérer tous les détails d'un tracteur
export async function getDetails( classification: string, tractorID: string) : Promise<TractorDetails> {
    try {
        const pageURL = BASE_URL + classification + "/" + tractorID;
        const response = await axios.get(pageURL, { headers });
        const $ = cheerio.load(response.data);

        // Récupération des valeurs
        const advert = await getSpecificDetails($, "Advert number") as number;
        const price = parseInt($('h2').text().replace(/\D/g, ''));
        const hours = await getSpecificDetails($, "Operating hours") as number;
        const year = await getSpecificDetails($, "Year of manufacture") as number;
        const advertiserStatut = await getSpecificDetails($, "Advertiser status") as string;
        const condition = await getSpecificDetails($, "Condition") as string;
        const description = $('p.break-words').text().trim();
        const location = await getSpecificDetails($, "Location") as string;

        // Mise à jour des détails
        details.location = location;
        details.condition = condition;
        details.price = price;
        details.advertiserStatut = advertiserStatut;
        details.year = year;
        details.hours = hours;
        details.advert = advert;
        details.description = description;

        // Print des détails
        return details;
    }
    catch (error) { 
        console.error("Erreur lors de la récupération des détails du tracteur :", error);
        throw error;
    }
}