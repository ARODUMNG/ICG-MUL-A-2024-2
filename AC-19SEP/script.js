// clase de primitivas
class Primitiva {
    constructor(svgElement) {
        this.svgElement = svgElement;
    }

    crearElementoSVG(tipo, atributos) {
        const elemento = document.createElementNS("http://www.w3.org/2000/svg", tipo);
        for (let atributo in atributos) {
            elemento.setAttribute(atributo, atributos[atributo]);
        }
        this.svgElement.appendChild(elemento);
    }
}

// Clase para dibujar una línea
class Linea extends Primitiva {
    constructor(svgElement, x1, y1, x2, y2) {
        super(svgElement);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    dibujar() {
        this.crearElementoSVG('line', {
            x1: this.x1,
            y1: this.y1,
            x2: this.x2,
            y2: this.y2,
            stroke: 'orange',
            'stroke-width': 2
        });
    }
}

// Clase para dibujar una circunferencia
class Circunferencia extends Primitiva {
    constructor(svgElement, cx, cy, r) {
        super(svgElement);
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    dibujar() {
        this.crearElementoSVG('circle', {
            cx: this.cx,
            cy: this.cy,
            r: this.r,
            stroke: 'red',
            'stroke-width': 2,
            fill: 'none'
        });
    }
}

// Clase para dibujar una elipse
class Elipse extends Primitiva {
    constructor(svgElement, cx, cy, rx, ry) {
        super(svgElement);
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
    }

    dibujar() {
        this.crearElementoSVG('ellipse', {
            cx: this.cx,
            cy: this.cy,
            rx: this.rx,
            ry: this.ry,
            stroke: 'pink',
            'stroke-width': 2,
            fill: 'none'
        });
    }
}

// Función principal para dibujar las primitivas
function dibujarPrimitivas() {
    const svg = document.getElementById('svg');

    // Dibuja una línea
    const linea = new Linea(svg, 50, 50, 200, 200);
    linea.dibujar();

    // Dibuja una circunferencia
    const circunferencia = new Circunferencia(svg, 300, 100, 50);
    circunferencia.dibujar();

    // Dibuja una elipse
    const elipse = new Elipse(svg, 400, 300, 80, 50);
    elipse.dibujar();
}

// Llamar a la función para dibujar las primitivas cuando se cargue la página
window.onload = dibujarPrimitivas;
