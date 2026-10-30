const botonChat = document.getElementById("chatbot-boton");
const chatbot = document.getElementById("chatbot");
const cerrarChat = document.getElementById("chatbot-cerrar");

const formulario = document.getElementById("chatbot-form");
const input = document.getElementById("chatbot-input");
const contenedorMensajes = document.getElementById("chatbot-mensajes");

botonChat.addEventListener("click", () => {
    chatbot.classList.toggle("activo");
});

cerrarChat.addEventListener("click", () => {
    chatbot.classList.remove("activo");
});

function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[¿?¡!.,;]/g, "")
        .trim();
}

function buscarRespuesta(pregunta) {

    const consulta = normalizarTexto(pregunta);

    let mejorResultado = null;
    let mejorPuntaje = 0;


    conocimiento.forEach(item => {

        let puntaje = 0;

        item.palabrasClave.forEach(frase => {

            const fraseNormalizada = normalizarTexto(frase);

            if (consulta.includes(fraseNormalizada)) {
                puntaje += 1;
            }

        });


        if (puntaje > mejorPuntaje) {

            mejorPuntaje = puntaje;
            mejorResultado = item;

        }

    });


    return mejorResultado;
}

function agregarMensaje(texto, tipo, resultado = null) {

    const mensaje = document.createElement("div");

    mensaje.classList.add("mensaje", tipo);

    mensaje.textContent = texto;


    if (resultado && resultado.url) {

        const enlace = document.createElement("a");

        enlace.href = resultado.url;
        enlace.textContent = resultado.boton;

        mensaje.appendChild(document.createElement("br"));
        mensaje.appendChild(enlace);
    }


    contenedorMensajes.appendChild(mensaje);

    contenedorMensajes.scrollTop =
        contenedorMensajes.scrollHeight;
}

formulario.addEventListener("submit", (evento) => {

    evento.preventDefault();

    const pregunta = input.value.trim();


    if (!pregunta) {
        return;
    }


    agregarMensaje(
        pregunta,
        "usuario"
    );


    input.value = "";


    const resultado = buscarRespuesta(pregunta);


    if (resultado) {

        agregarMensaje(
            resultado.respuesta,
            "bot",
            resultado
        );

    } else {

        agregarMensaje(
            "No pude identificar exactamente qué información estás buscando. Puedes preguntarme por la Red CITE, servicios tecnológicos, estadísticas o ubicación de los CITE.",
            "bot"
        );

    }

});