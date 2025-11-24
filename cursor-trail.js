// ============================================
// CURSOR TRAIL EFFECT
// ============================================

// Activar cursor trail
document.body.classList.add('has-cursor-trail');

let trailElements = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    // Crear nuevo elemento de trail
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    document.body.appendChild(trail);
    
    // Agregar a la lista
    trailElements.push(trail);
    
    // Limitar cantidad de elementos
    if (trailElements.length > maxTrailLength) {
        const oldTrail = trailElements.shift();
        if (oldTrail && oldTrail.parentNode) {
            oldTrail.parentNode.removeChild(oldTrail);
        }
    }
    
    // Remover después de la animación
    setTimeout(() => {
        if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
        }
        trailElements = trailElements.filter(el => el !== trail);
    }, 500);
});

// Restaurar cursor normal en elementos interactivos
document.querySelectorAll('button, a, input, .emote-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'pointer';
    });
    el.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'default';
    });
});

