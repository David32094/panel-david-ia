// ============================================
// DATOS DE EMOTES
// ============================================
// Este archivo contiene la información de todos los emotes
// Los nombres se generan automáticamente usando weapon-names.js

const EMOTES_DATA = {
    evolutivas: [
        // Evolutivas (1-17) - Los nombres se obtienen de WEAPON_NAMES
        {
            Number: "1",
            Id: "909000063",  // ID real del AK47 según el bot
            Image: "emotes/evolutivas/evolutiva 1.png"  // Ruta: Panel David IA/emotes/evolutivas/evolutiva 1.png
        },
        {
            Number: "2",
            Id: "909000068",  // ID real del SCAR según el bot
            Image: "emotes/evolutivas/evolutiva 2.png"
        },
        {
            Number: "3",
            Id: "909000075",  // ID real del MP40 (1st) según el bot
            Image: "emotes/evolutivas/evolutiva 3.png"
        },
        {
            Number: "4",
            Id: "909040010",  // ID real del MP40 (2nd) según el bot
            Image: "emotes/evolutivas/evolutiva 4.png"
        },
        {
            Number: "5",
            Id: "909000081",  // ID real del M1014 (1st) según el bot
            Image: "emotes/evolutivas/evolutiva 5.png"
        },
        {
            Number: "6",
            Id: "909039011",  // ID real del M1014 (2nd) según el bot
            Image: "emotes/evolutivas/evolutiva 6.png"
        },
        {
            Number: "7",
            Id: "909000085",  // ID real del XM8 según el bot
            Image: "emotes/evolutivas/evolutiva 7.png"
        },
        {
            Number: "8",
            Id: "909000090",  // ID real del FAMAS según el bot
            Image: "emotes/evolutivas/evolutiva 8.png"
        },
        {
            Number: "9",
            Id: "909000098",  // ID real del UMP según el bot
            Image: "emotes/evolutivas/evolutiva 9.png"
        },
        {
            Number: "10",
            Id: "909035007",  // ID real del M1887 según el bot
            Image: "emotes/evolutivas/evolutiva 10.png"
        },
        {
            Number: "11",
            Id: "909042008",  // ID real del Woodpecker según el bot
            Image: "emotes/evolutivas/evolutiva 11.png"
        },
        {
            Number: "12",
            Id: "909041005",  // ID real del Groza según el bot
            Image: "emotes/evolutivas/evolutiva 12.png"
        },
        {
            Number: "13",
            Id: "909033001",  // ID real del M4A1 según el bot
            Image: "emotes/evolutivas/evolutiva 13.png"
        },
        {
            Number: "14",
            Id: "909038010",  // ID real del Thompson según el bot
            Image: "emotes/evolutivas/evolutiva 14.png"
        },
        {
            Number: "15",
            Id: "909038012",  // ID real del G18 según el bot
            Image: "emotes/evolutivas/evolutiva 15.png"
        },
        {
            Number: "16",
            Id: "909045001",  // ID real del Parafal según el bot
            Image: "emotes/evolutivas/evolutiva 16.png"
        },
        {
            Number: "17",
            Id: "909049010",  // ID real del P90 según el bot
            Image: "emotes/evolutivas/evolutiva 17.png"
        }
        // Agregar más emotes evolutivas aquí si es necesario
    ],
    
    normales: [
        // Emotes normales - Usar números de emotes.json
        // Ejemplo: si el emote normal tiene Number "10" en emotes.json
        {
            Number: "10",  // Número del emote en emotes.json
            Id: "909000010",  // ID del emote en emotes.json
            Image: "emotes/normales/normal-10.png"  // Ruta: Panel David IA/emotes/normales/normal-10.png
        }
        // Agregar más emotes normales aquí según emotes.json
        // Formato: Number debe coincidir con el "Number" en emotes.json
    ],
    
    duo: [
        // Emotes dúo - Usar números de emotes.json
        // Ejemplo: si el emote dúo tiene Number "50" en emotes.json
        {
            Number: "50",  // Número del emote en emotes.json
            Id: "909000052",  // ID del emote en emotes.json
            Image: "emotes/duo/duo-50.png"  // Ruta: Panel David IA/emotes/duo/duo-50.png
        },
        {
            Number: "51",  // Número del emote en emotes.json
            Id: "909000053",  // ID del emote en emotes.json
            Image: "emotes/duo/duo-51.png"  // Ruta: Panel David IA/emotes/duo/duo-51.png
        }
        // Agregar más emotes dúo aquí según emotes.json
    ]
};

// ============================================
// NOTAS PARA COMPLETAR LOS DATOS:
// ============================================
// 1. Reemplazar los ejemplos con los emotes reales
// 2. Agregar las rutas correctas a las imágenes
// 3. Asegurarse de que Number e Id coincidan con los datos del juego
// 4. Mantener el formato JSON válido

