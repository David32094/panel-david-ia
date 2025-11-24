// ============================================
// EJEMPLO DE SERVIDOR API PARA INTEGRACIÓN
// ============================================
// Este es un ejemplo de cómo crear un servidor simple
// que reciba comandos del panel y los envíe al bot

// Opción 1: Node.js con Express
/*
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Endpoint para recibir comandos del panel
app.post('/api/send-command', async (req, res) => {
    const { command, uid, emote_number } = req.body;
    
    console.log(`Comando recibido: ${command}`);
    
    // Aquí puedes:
    // 1. Enviar el comando al bot via WebSocket
    // 2. Escribir a un archivo que el bot lea
    // 3. Enviar a una base de datos
    // 4. Llamar directamente a una función del bot
    
    // Ejemplo: Escribir a archivo
    const fs = require('fs');
    fs.appendFileSync('bot_commands.txt', `${command}\n`);
    
    res.json({
        success: true,
        message: `Comando ${command} enviado correctamente`
    });
});

app.listen(PORT, () => {
    console.log(`API servidor corriendo en http://localhost:${PORT}`);
});
*/

// ============================================
// Opción 2: Python con Flask
/*
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permitir CORS para el panel web

@app.route('/api/send-command', methods=['POST'])
def send_command():
    data = request.json
    command = data.get('command')
    uid = data.get('uid')
    emote_number = data.get('emote_number')
    
    print(f"Comando recibido: {command}")
    
    # Aquí puedes enviar el comando al bot
    # Ejemplo: Escribir a archivo
    with open('bot_commands.txt', 'a') as f:
        f.write(f"{command}\n")
    
    return jsonify({
        'success': True,
        'message': f'Comando {command} enviado correctamente'
    })

if __name__ == '__main__':
    app.run(port=3000, debug=True)
*/

// ============================================
// Opción 3: Integración Directa con el Bot
// ============================================
// Si el bot está en Python, puedes crear un endpoint simple
// que escriba los comandos a un archivo que el bot lea:

/*
# En el bot (app.py), agregar una función que lea comandos:
import os
import time

COMMANDS_FILE = "panel_commands.txt"

def read_panel_commands():
    if not os.path.exists(COMMANDS_FILE):
        return []
    
    with open(COMMANDS_FILE, 'r') as f:
        commands = f.readlines()
    
    # Limpiar archivo después de leer
    with open(COMMANDS_FILE, 'w') as f:
        pass
    
    return [cmd.strip() for cmd in commands if cmd.strip()]

# En el loop principal del bot:
while True:
    commands = read_panel_commands()
    for cmd in commands:
        # Procesar comando como si viniera del chat
        process_command(cmd)
    time.sleep(0.5)
*/

// ============================================
// Opción 4: WebSocket (Tiempo Real)
// ============================================
// Para comunicación en tiempo real, usar WebSocket:

/*
// Cliente (Panel - modificar script.js):
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
    console.log('Conectado al bot');
};

function sendCommand(command) {
    ws.send(JSON.stringify({
        type: 'command',
        command: command
    }));
}

// Servidor (Bot):
import asyncio
import websockets

async def handle_client(websocket, path):
    async for message in websocket:
        data = json.loads(message)
        if data['type'] == 'command':
            # Procesar comando
            process_command(data['command'])

start_server = websockets.serve(handle_client, "localhost", 8080)
asyncio.get_event_loop().run_until_complete(start_server)
*/

// ============================================
// NOTAS DE INTEGRACIÓN
// ============================================
// 1. El panel envía comandos en formato: /play [UID] [Number]
// 2. El bot debe procesar estos comandos igual que los del chat
// 3. Puedes usar archivo, base de datos, WebSocket o API REST
// 4. Asegúrate de manejar CORS si el panel está en otro dominio

