const shapes = []; // Array para almacenar las figuras

function drawShape() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const shape = document.getElementById('shape').value;
    const x = parseInt(document.getElementById('x').value);
    const y = parseInt(document.getElementById('y').value);
    const size = parseInt(document.getElementById('size').value);
    const fillColor = document.getElementById('fillColor').value;
    const borderColor = document.getElementById('borderColor').value;

    shapes.push({ shape, x, y, size, fillColor, borderColor });
    redrawShapes();
}

function redrawShapes() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(({ shape, x, y, size, fillColor, borderColor }) => {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;

        switch (shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;

            case 'square':
                ctx.beginPath();
                ctx.rect(x - size / 2, y - size / 2, size, size);
                ctx.fill();
                ctx.stroke();
                break;

            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(x, y - size / 2);
                ctx.lineTo(x - size / 2, y + size / 2);
                ctx.lineTo(x + size / 2, y + size / 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            case 'pentagon':
                const angle = (2 * Math.PI) / 5;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const currentAngle = angle * i - Math.PI / 10;
                    const xOffset = size * Math.cos(currentAngle);
                    const yOffset = size * Math.sin(currentAngle);
                    if (i === 0) {
                        ctx.moveTo(x + xOffset, y + yOffset);
                    } else {
                        ctx.lineTo(x + xOffset, y + yOffset);
                    }
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            default:
                break;
        }
    });
}

function clearLastShape() {
    shapes.pop();
    redrawShapes();
}

function clearAllShapes() {
    shapes.length = 0; // Vaciar el array de figuras
    redrawShapes();
}

function saveImage() {
    const canvas = document.getElementById('canvas');
    const format = document.getElementById('outputFormat').value;

    if (format === 'raster') {
        // Rasterizar (PNG)
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'drawing.png';
        link.click();
    } else if (format === 'vector') {
        // Vectorizar (SVG)
        const svg = createSVG();
        const link = document.createElement('a');
        link.href = 'data:image/svg+xml;base64,' + btoa(svg);
        link.download = 'drawing.svg';
        link.click();
    }
}

function createSVG() {
    const canvas = document.getElementById('canvas');
    const width = canvas.width;
    const height = canvas.height;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;

    shapes.forEach(({ shape, x, y, size, fillColor, borderColor }) => {
        let pathData = '';
        switch (shape) {
            case 'circle':
                pathData = `<circle cx="${x}" cy="${y}" r="${size}" fill="${fillColor}" stroke="${borderColor}" stroke-width="2"/>`;
                break;
            case 'square':
                pathData = `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" fill="${fillColor}" stroke="${borderColor}" stroke-width="2"/>`;
                break;
            case 'triangle':
                pathData = `
                    <polygon points="${x},${y - size / 2} ${x - size / 2},${y + size / 2} ${x + size / 2},${y + size / 2}"
                    fill="${fillColor}" stroke="${borderColor}" stroke-width="2"/>
                `;
                break;
            case 'pentagon':
                const angle = (2 * Math.PI) / 5;
                let points = '';
                for (let i = 0; i < 5; i++) {
                    const currentAngle = angle * i - Math.PI / 10;
                    const xOffset = size * Math.cos(currentAngle);
                    const yOffset = size * Math.sin(currentAngle);
                    points +=`${x + xOffset},${y + yOffset} `;
                }
                pathData = `<polygon points="${points.trim()}" fill="${fillColor}" stroke="${borderColor}" stroke-width="2"/>`;
                break;
        }
        svg += pathData;
    });

    svg += '</svg>';
    return svg;
}