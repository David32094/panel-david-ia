// ============================================
// MAPEO DE EMOTES A NOMBRES DE ARMAS
// ============================================
// Este archivo mapea los números de emotes a los nombres de las armas
// Basado en el mapeo del bot: evo_emotes

const WEAPON_NAMES = {
    // Evolutivas (1-17, 146, 211) - Mapeo exacto del bot
    // Nota: Los números 2, 7, 12 son normales, no evolutivas
    "1": "AK47",           // 909000063
    "3": "MP40",           // 909000075 (1st MP40)
    "4": "MP40",           // 909040010 (2nd MP40)
    "5": "M1014",          // 909000081 (1st M1014)
    "6": "M1014",          // 909039011 (2nd M1014)
    "8": "FAMAS",          // 909000090
    "9": "UMP",            // 909000098
    "10": "M1887",         // 909035007
    "11": "Woodpecker",    // 909042008
    "13": "M4A1",          // 909033001
    "14": "Thompson",      // 909038010
    "15": "G18",           // 909038012
    "16": "Parafal",       // 909045001
    "17": "P90",           // 909049010
    "146": "MP5 evolutiva", // 909033002
    "180": "AN94",         // 909035012
    "211": "Puño evolutivos", // 909038004
    
    // Emotes normales
    "2": "Risa",           // 909000002
    "7": "Pio Piu",        // 909000007
    "12": "Lagartija",     // 909000012
    "20": "Paso del mal",  // 909000020
    "33": "Bandera marrón", // 909000034
    "75": "Bailesito",     // 909000077
    "93": "Pingüinito",    // 909000095
    "133": "Piedra, papel o tijera", // 909000135
    "140": "Mueve la cola como Anitta", // 909000142
    "168": "Ajolote moviéndolo", // 909034014
    "190": "Emote 190",    // 909036008
    "196": "Venado",       // 909037001
    "206": "Emote 206",    // 909037011
    "208": "Emote 208",    // 909038001
    "268": "Emote 268",    // 909042007
    "291": "Oveja",        // 909044004
    
    // Agregar más nombres según corresponda
};

// Función para obtener el nombre del arma
function getWeaponName(emoteNumber) {
    return WEAPON_NAMES[emoteNumber] || `Emote #${emoteNumber}`;
}


