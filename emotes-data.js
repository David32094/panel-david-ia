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
        },
        {
            Number: "146",
            Id: "909033002",  // MP5 evolutiva
            Image: "emotes/evolutivas/evolutiva 146.png"
        },
        {
            Number: "211",
            Id: "909038004",  // Puño evolutivos
            Image: "emotes/evolutivas/evolutiva 211.png"
        },
        {
            Number: "180",
            Id: "909035012",  // AN94 evolutiva
            Image: "emotes/evolutivas/evolutiva 180.png"
        }
        // Agregar más emotes evolutivas aquí si es necesario
    ],
    
    normales: [
        // Emotes normales - Solo los especificados
        {
            Number: "2",
            Id: "909000002",  // Risa
            Image: "emotes/normales/normal-2.png"
        },
        {
            Number: "7",
            Id: "909000007",  // Pio Piu
            Image: "emotes/normales/normal-7.png"
        },
        {
            Number: "12",
            Id: "909000012",  // Lagartija
            Image: "emotes/normales/normal-12.png"
        },
        {
            Number: "20",
            Id: "909000020",  // Paso del mal
            Image: "emotes/normales/normal-20.png"
        },
        {
            Number: "33",
            Id: "909000034",  // Bandera marrón
            Image: "emotes/normales/normal-33.png"
        },
        {
            Number: "75",
            Id: "909000077",  // Bailesito
            Image: "emotes/normales/normal-75.png"
        },
        {
            Number: "93",
            Id: "909000095",  // Pingüinito
            Image: "emotes/normales/normal-93.png"
        },
        {
            Number: "133",
            Id: "909000135",  // Piedra, papel o tijera
            Image: "emotes/normales/normal-133.png"
        },
        {
            Number: "140",
            Id: "909000142",  // Mueve la cola como Anitta
            Image: "emotes/normales/normal-140.png"
        },
        {
            Number: "168",
            Id: "909034014",  // Ajolote moviéndolo
            Image: "emotes/normales/normal-168.png"
        },
        {
            Number: "190",
            Id: "909036008",  // Sin nombre
            Image: "emotes/normales/normal-190.png"
        },
        {
            Number: "196",
            Id: "909037001",  // Venado
            Image: "emotes/normales/normal-196.png"
        },
        {
            Number: "206",
            Id: "909037011",  // Sin nombre
            Image: "emotes/normales/normal-206.png"
        },
        {
            Number: "208",
            Id: "909038001",  // Sin nombre
            Image: "emotes/normales/normal-208.png"
        },
        {
            Number: "268",
            Id: "909042007",  // Sin nombre
            Image: "emotes/normales/normal-268.png"
        },
        {
            Number: "291",
            Id: "909044004",  // Oveja
            Image: "emotes/normales/normal-291.png"
        }
        // Agregar más emotes normales aquí según emotes.json
        // Formato: Number debe coincidir con el "Number" en emotes.json
        // Las imágenes deben estar en: Panel David IA/emotes/normales/normal-{Number}.png
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


