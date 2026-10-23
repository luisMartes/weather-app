let formulario = document.querySelector("#formulario");
let inputCiudad = document.querySelector("#ciudad");
let resultado = document.querySelector("#resultado");
let frase = document.querySelector("#quote");

async function cita() {

    let respuesta = await fetch("https://quoteslate.vercel.app/api/quotes/random");
    let datos = await respuesta.json();
    console.log(datos.quote);

    frase.textContent = datos.quote;
}
cita();

formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    let ciudad = inputCiudad.value;

    let respuesta = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es&format=json`
    );

    let datos = await respuesta.json();

    if (!datos.results || datos.results.length === 0) {
        resultado.innerHTML = "<p>No encontramos esa ciudad.</p>";
        return;
    }

    let lugar = datos.results[0];
    let respuestaClima = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lugar.latitude}&longitude=${lugar.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
    );

    let datosClima = await respuestaClima.json();

    console.log(datosClima.current);

    let temperatura = datosClima.current;

    let fechaBonita = new Date(
        temperatura.time
    ).toLocaleString("es-MX", {
        dateStyle: "long",
        timeStyle: "short"
    });
    console.log(fechaBonita);

    resultado.innerHTML = `
    <div class = "lugar">
    <h3>${lugar.name}</h3>
    </div>
    <div class = "clima">
    <p> ${fechaBonita}</p>
    <p> ${temperatura.temperature_2m} °c</p>
    </div>
    `;





});