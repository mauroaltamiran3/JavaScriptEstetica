class IntroducirHTML {
    cssBody(bg,fontColor,fontFamily) {
        document.body.style.backgroundColor = `${bg}`;
        document.body.style.color = `${fontColor}`;
        document.body.style.fontFamily = `${fontFamily}`;
        document.body.style.margin = '0px';
        document.body.style.padding = '0px';
    }

    cssMain() {
        main.style.height = '100vh';
        main.style.margin = '0';
        main.style.alignContent = 'center';

        contenedorServicios.style.display = 'flex';
        contenedorServicios.style.justifyContent = 'space-around';
    }

    mostrarH2(contenedor,contenido) {
        const h2 = document.createElement('h2');
        h2.style.textAlign = 'center';
        h2.textContent = `${contenido}`;
        contenedor.appendChild(h2);
    }

    mostrarH3(contenedor,contenido) {
        const h3 = document.createElement('h3');
        h3.textContent = `${contenido}`;
        h3.style.margin = '0 0 10px 0';
        contenedor.appendChild(h3);
    }
}

const agregarHtml = new IntroducirHTML;