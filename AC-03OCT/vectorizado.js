class Punto {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let points = [];

// Función para generar puntos aleatorios
function generarPuntosAleatorios(cantidad) {
    points = [];
    for (let i = 0; i < cantidad; i++) {
        const x = Math.floor(Math.random() * 10) - 5; // Puntos entre -5 y 5
        const y = Math.floor(Math.random() * 10) - 5; // Puntos entre -5 y 5
        points.push(new Punto(x, y));
    }
}
function mostrarCentroide() {
    const centroide = calcularCentroide(puntos);
    ctx.beginPath();
    ctx.arc(centroide[0] + 250, centroide[1] + 250, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    puntos.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(centroide[0] + 250, centroide[1] + 250);
        ctx.lineTo(p[0] + 250, p[1] + 250);
        ctx.strokeStyle = "red";
        ctx.stroke();
    });
}

// Paso 1: Calcular el centroide
function calcularCentroide(puntos) {
    const suma = puntos.reduce((acc, punto) => {
        acc.x += punto.x;
        acc.y += punto.y;
        return acc;
    }, { x: 0, y: 0 });

    return new Punto(suma.x / puntos.length, suma.y / puntos.length);
}
function toggleCentroide() {
    centroideVisible = !centroideVisible;
    dibujarPoligono();
}

// Función para calcular el ángulo respecto al centroide
function anguloDesdeCentroide(punto, centroide) {
    return Math.atan2(punto.y - centroide.y, punto.x - centroide.x);
}
// Ordenar los puntos por ángulo
function ordenarPuntosPorAngulo(puntos, centroide) {
    return puntos.sort((a, b) => anguloDesdeCentroide(a, centroide) - anguloDesdeCentroide(b, centroide));
}

// Calcular el producto cruzado
function productoCruzado(o, a, b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

// Verificar la orientación de los productos cruzados
function verificarConvexidad(puntos) {
    const n = puntos.length;
    const productosCruzados = [];

    for (let i = 0; i < n; i++) {
        const o = puntos[i];
        const a = puntos[(i + 1) % n];
        const b = puntos[(i + 2) % n];
        productosCruzados.push(productoCruzado(o, a, b));
    }

    const positivo = productosCruzados.every(cp => cp > 0);
    const negativo = productosCruzados.every(cp => cp < 0);

    return positivo || negativo;
}

function dibujarPoligono(points) {
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = ''; // Limpiar el canvas antes de dibujar

    const n = points.length;

    let path = 'M ' + (points[0].x * 50 + 250) + ' ' + (250 - points[0].y * 50); // Escala y ajuste
    for (let i = 1; i < n; i++) {
        path += ' L ' + (points[i].x * 50 + 250) + ' ' + (250 - points[i].y * 50);
    }
    path += ' Z';

    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svgPath.setAttribute("d", path);
    svgPath.setAttribute("fill", "lightblue");
    svgPath.setAttribute("stroke", "black");

    canvas.appendChild(svgPath);
}

function generarPoligono() {
    generarPuntosAleatorios(6); // Generar 6 puntos aleatorios
    const centroide = calcularCentroide(points);
    const puntosOrdenados = ordenarPuntosPorAngulo(points, centroide);
    const esConvexo = verificarConvexidad(puntosOrdenados);

    // Mostrar resultados
    const resultado = document.getElementById('result');
    resultado.innerText = `Se utilizaron ${puntosOrdenados.length} puntos. ` +
                          (esConvexo ? "Los puntos forman una figura convexa." : "Los puntos forman una figura cóncava.");

    dibujarPoligono(puntosOrdenados);
}

// Asignar evento al botón
document.getElementById('generateBtn').addEventListener('click', generarPoligono);
