# 🔧 INSTRUCCIONES PARA ARREGLAR EL BOT

## Problema
El bot está procesando `/join` y `/solo` como si fueran comandos de emote, cuando deberían ser comandos de equipo.

## Solución
En el código del bot, donde procesa los comandos del panel web, debes agregar una verificación ANTES de procesar como emote.

## Código a modificar en el bot

Busca en tu código del bot donde procesa los comandos del panel (probablemente en la función que maneja `/api/send-command`).

### ANTES (código actual - INCORRECTO):
```python
# El bot está procesando todos los comandos como emote
command = request_data.get('command', '')
uid = request_data.get('uid', '')
emote_number = request_data.get('emote_number', '')

# ❌ PROBLEMA: Está procesando directamente como emote sin verificar
if emote_number:
    # Procesar como emote
    process_emote(uid, emote_number)
```

### DESPUÉS (código corregido):
```python
# El bot debe verificar el tipo de comando PRIMERO
command = request_data.get('command', '')
uid = request_data.get('uid', '')
emote_number = request_data.get('emote_number', '')

# ✅ SOLUCIÓN: Verificar el comando ANTES de procesar
if command.startswith('/join'):
    # Procesar como comando de unirse a equipo
    team_code = command.split()[1] if len(command.split()) > 1 else None
    if team_code:
        # Ejecutar comando de unirse al equipo
        # Ejemplo: send_team_command(f"/join {team_code}")
        result = execute_join_team(team_code)
        return {"success": result, "message": "Unido al equipo" if result else "Error al unirse"}
    else:
        return {"success": False, "message": "Código de equipo no proporcionado"}

elif command == '/solo':
    # Procesar como comando de salir del equipo
    result = execute_leave_team()
    return {"success": result, "message": "Salido del equipo" if result else "Error al salir"}

elif command.startswith('/ev') or command.startswith('/play'):
    # Procesar como comando de emote (solo si es /ev o /play)
    if emote_number and uid:
        result = process_emote(uid, emote_number)
        return {"success": result, "message": "Emote ejecutado" if result else "Error al ejecutar emote"}
    else:
        return {"success": False, "message": "UID o número de emote no proporcionado"}

else:
    return {"success": False, "message": f"Comando desconocido: {command}"}
```

## Estructura del código corregido

```python
def handle_panel_command(request_data):
    command = request_data.get('command', '')
    uid = request_data.get('uid', '')
    emote_number = request_data.get('emote_number', '')
    
    # VERIFICAR TIPO DE COMANDO PRIMERO
    if command.startswith('/join'):
        # Comando de unirse a equipo
        return handle_join_team(command)
    
    elif command == '/solo':
        # Comando de salir del equipo
        return handle_leave_team()
    
    elif command.startswith('/ev') or command.startswith('/play'):
        # Comando de emote
        return handle_emote(command, uid, emote_number)
    
    else:
        return {"success": False, "message": f"Comando desconocido: {command}"}
```

## Payload que recibe el bot

### Para `/join`:
```json
{
  "command": "/join 8908505",
  "uid": "",
  "emote_number": "",
  "category": null,
  "command_type": "/play"
}
```

### Para `/ev` o `/play`:
```json
{
  "command": "/ev 1871874003 1",
  "uid": "1871874003",
  "emote_number": "1",
  "category": "evolutivas",
  "command_type": "/ev"
}
```

### Para `/solo`:
```json
{
  "command": "/solo",
  "uid": "",
  "emote_number": "",
  "category": null,
  "command_type": "/play"
}
```

## Importante

El bot debe verificar el campo `command` ANTES de procesar como emote. El campo `command_type` es solo informativo, el bot debe usar el campo `command` para determinar qué hacer.

## Logs esperados después del fix

```
[PANEL] Request recibido: command=/join 8908505
[PANEL] Detectado como comando de equipo: /join
[PANEL] Ejecutando: /join 8908505
[PANEL] ✅ Unido al equipo exitosamente
```

En lugar de:
```
[PANEL] Request recibido: command=/join 8908505
[PANEL] Detectado como emote normal/dúo  ❌ INCORRECTO
```

