const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageLoader = document.getElementById('imageLoader');
const colorPicker = document.getElementById('colorPicker');
const scanFillButton = document.getElementById('scanFillButton');
const floodFillButton = document.getElementById('floodFillButton');

let img = new Image();
let imageData;
let fillColor;

imageLoader.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        img.src = e.target.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    }
});

img.onload = function() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

colorPicker.addEventListener('input', (event) => {
    fillColor = hexToRgb(event.target.value);
});

floodFillButton.addEventListener('click', () => {
    const x = Math.floor(canvas.width / 2); // Cambiar a la posición deseada
    const y = Math.floor(canvas.height / 2); // Cambiar a la posición deseada
    floodFill(x, y);
});

scanFillButton.addEventListener('click', () => {
    const x = Math.floor(canvas.width / 2); // Cambiar a la posición deseada
    const y = Math.floor(canvas.height / 2); // Cambiar a la posición deseada
    scanFill(x, y);
});

// Funciones de relleno
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

// Relleno FloodFill
function floodFill(startX, startY) {
    const targetColor = getPixelColor(startX, startY);
    const stack = [[startX, startY]];
    let delay = 10; // Tiempo de espera en milisegundos

    if (colorsMatch(targetColor, fillColor) || colorsMatch(targetColor, { r: 0, g: 0, b: 0 })) {
        return; // No hacer nada si el color ya es el mismo o es transparente
    }

    function fillNext() {
        if (stack.length === 0) {
            ctx.putImageData(imageData, 0, 0); // Actualiza el canvas una vez finalizado
            return; // Termina si no hay más píxeles en la pila
        }

        while (stack.length > 0) {
        const [x, y] = stack.pop();

        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
        if (!colorsMatch(getPixelColor(x, y), targetColor)) continue;

        // Cambiar el color del píxel
        setPixelColor(x, y, fillColor);

        // Añadir píxeles vecinos a la pila
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
        }
        // Actualiza el canvas con el nuevo color
        ctx.putImageData(imageData, 0, 0);

        // Llama a la función después de un retraso
        setTimeout(fillNext, delay);
    }

    fillNext(); // Inicia el proceso de relleno
}

// Scan-Fill con retraso
function scanFill(startX, startY) {
    const targetColor = getPixelColor(startX, startY);
    if (colorsMatch(targetColor, fillColor) || colorsMatch(targetColor, { r: 0, g: 0, b: 0 })) {
        return; // No hacer nada si el color ya es el mismo o es transparente
    }

    let x = startX;
    let y = startY;
    let delay = 0.0001; // Tiempo de espera en milisegundos
    const pixelsToFill = []; // Array para almacenar los píxeles a rellenar

    // Expandir hacia la derecha
    while (x < canvas.width && colorsMatch(getPixelColor(x, y), targetColor)) {
        pixelsToFill.push({ x, y });
        x++;
    }

    // Expandir hacia la izquierda
    let leftBoundary = x;
    x = startX;

    while (x >= 0 && colorsMatch(getPixelColor(x, y), targetColor)) {
        pixelsToFill.push({ x, y });
        x--;
    }

    // Rellenar desde el límite izquierdo hasta el límite derecho
    for (let fillX = x + 1; fillX < leftBoundary; fillX++) {
        pixelsToFill.push({ x: fillX, y });
    }

    // Rellenar en las filas superiores e inferiores
    fillScanLine(y - 1, leftBoundary, startX, targetColor, pixelsToFill);
    fillScanLine(y + 1, leftBoundary, startX, targetColor, pixelsToFill);

    function fillNextPixel() {
        if (pixelsToFill.length === 0) {
            ctx.putImageData(imageData, 0, 0); // Actualiza el canvas una vez finalizado
            return; // Termina si no hay más píxeles
        }

        const { x, y } = pixelsToFill.pop();
        setPixelColor(x, y, fillColor);

        // Actualiza el canvas con el nuevo color
        ctx.putImageData(imageData, 0, 0);

        // Llama a la función después de un retraso
        setTimeout(fillNextPixel, delay);
    }

    fillNextPixel(); // Inicia el proceso de relleno
}

function fillScanLine(y, leftBoundary, startX, targetColor, pixelsToFill) {
    while (y >= 0 && colorsMatch(getPixelColor(startX, y), targetColor)) {
        let x = startX;

        // Expandir hacia la izquierda
        while (x >= 0 && colorsMatch(getPixelColor(x, y), targetColor)) {
            pixelsToFill.push({ x, y });
            x--;
        }

        // Expandir hacia la derecha
        x = startX;
        while (x < canvas.width && colorsMatch(getPixelColor(x, y), targetColor)) {
            pixelsToFill.push({ x, y });
            x++;
        }

        y--; // Moverse hacia la fila superior
    }

    y += 2; // Regresar a la fila siguiente (inferior)

    while (y < canvas.height && colorsMatch(getPixelColor(startX, y), targetColor)) {
        let x = startX;

        // Expandir hacia la izquierda
        while (x >= 0 && colorsMatch(getPixelColor(x, y), targetColor)) {
            pixelsToFill.push({ x, y });
            x--;
        }

        // Expandir hacia la derecha
        x = startX;
        while (x < canvas.width && colorsMatch(getPixelColor(x, y), targetColor)) {
            pixelsToFill.push({ x, y });
            x++;
        }

        y++; // Moverse hacia la fila siguiente (inferior)
    }
}

function getPixelColor(x, y) {
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        return null; // Fuera de límites
    }
    const index = (y * imageData.width + x) * 4;
    return {
        r: imageData.data[index],
        g: imageData.data[index + 1],
        b: imageData.data[index + 2],
        a: imageData.data[index + 3]
    };
}

function setPixelColor(x, y, color) {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = color.r;
    imageData.data[index + 1] = color.g;
    imageData.data[index + 2] = color.b;
    imageData.data[index + 3] = 255; // Opaque
}

function colorsMatch(color1, color2) {
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
}
