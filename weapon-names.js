// ============================================
// MAPEO DE EMOTES A NOMBRES DE ARMAS
// ============================================
// Este archivo mapea los números de emotes a los nombres de las armas
// Basado en el mapeo del bot: evo_emotes

const WEAPON_NAMES = {
    // Evolutivas (1-17) - Mapeo exacto del bot
    "1": "AK47",           // 909000063
    "2": "SCAR",           // 909000068
    "3": "MP40",           // 909000075 (1st MP40)
    "4": "MP40",           // 909040010 (2nd MP40)
    "5": "M1014",          // 909000081 (1st M1014)
    "6": "M1014",          // 909039011 (2nd M1014)
    "7": "XM8",            // 909000085
    "8": "FAMAS",          // 909000090
    "9": "UMP",            // 909000098
    "10": "M1887",         // 909035007
    "11": "Woodpecker",    // 909042008
    "12": "Groza",         // 909041005
    "13": "M4A1",          // 909033001
    "14": "Thompson",      // 909038010
    "15": "G18",           // 909038012
    "16": "Parafal",       // 909045001
    "17": "P90",           // 909049010
    
    // Agregar más nombres según corresponda
};

// Función para obtener el nombre del arma
function getWeaponName(emoteNumber) {
    return WEAPON_NAMES[emoteNumber] || `Emote #${emoteNumber}`;
}

