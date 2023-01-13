//Selectores
let listaDePalabras = [  "GITHUB","GIT","JAVA","SQL", "HTML",  "JAVASCRIPT",
  "ALURA",  "ORACLE","CSS","CHALLENGE","MOUSE","COMPUTADORA","CANVAS","TECNOLOGIA","AURICULARES",
];
let letrero = document.getElementById("letrero").getContext("2d");
let tablero = document.getElementById("ahorcado").getContext("2d");
let palabraSecreta = "";
let erroresRestantes = 6;
let letrasErroneas = [];
let letrasCorrectas = [];

//Muestra el campo para agregar una nueva palabra secreta. la propiedad grid-template-areaspropiedad CSS especifica áreas de cuadrícula con nombre , estableciendo las celdas en la cuadrícula y asignándoles nombres.
// El toUpperCase()método convierte una cadena en letras mayúsculas.
// El location.reload()método vuelve a cargar la URL actual, como el botón Actualizar.
function nuevaPalabra() {
  document.getElementById("pantalla-botones").style.display = "none";
  document.getElementById("palabra-nueva").style.display = "grid";
  document.getElementById("cuerpo").style.gridTemplateAreas =
    '"iniciado" "nueva-palabra" "contenedor-footer"';
}

function guardarPalabra() {
  let nuevaPalabraSecreta = document.getElementById(
    "nueva-palabra-secreta"
  ).value;

  if (nuevaPalabraSecreta !== "") {
    listaDePalabras.push(nuevaPalabraSecreta.toUpperCase());
    swal("¡Listo!", "Se guardó la palabra.", "success");
    document.getElementById("palabra-nueva").style.display = "none";
    document.getElementById("nueva-palabra-secreta").value = "";
    iniciarJuego();
  } else {
    swal("¡Error!", "No se ha ingresaddo ninguna palabra.", "success");
  }
}

function volverAlInicio() {
  location.reload();
}

//Iniciar juego
function iniciarJuego() {
  document.getElementById("pantalla-botones").style.display = "none";
  document.getElementById("pantalla-juego").style.display = "grid";
  document.getElementById("cuerpo").style.gridTemplateAreas =
    '"iniciado" "canvas" "contenedor-footer"';

  for (let i = letrasErroneas.length; i !== 0; i = i - 1) {
    letrasErroneas.pop();
  }
  for (let i = letrasCorrectas.length; i !== 0; i = i - 1) {
    letrasCorrectas.pop();
  }
  erroresRestantes = 6;
  tablero.clearRect(0, 0, 294, 360);
  seleccionarPalabraSecreta();
  dibujarAhorcado();
  dibujarGuiones();

  //El método includes()determina si una matriz incluye un elemento determinado, devuelve trueo false según corresponda. Se ejecuta al pulsar una tecla y la convierte en mayuscula
  document.onkeydown = (e) => {
    let tecla = e.key.toUpperCase();
    if (verificarTecla(tecla)) {
      let letra = tecla;
      if (palabraSecreta.includes(tecla) && !letrasCorrectas.includes(tecla)) {
        for (let i = 0; i < palabraSecreta.length; i++) {
          if (palabraSecreta[i] === letra) {
            mostrarLetraCorrecta(i);
            agregarAcierto(palabraSecreta[i]);
            verificarGanador();
          }
        }
      } else if (
        !letrasErroneas.includes(letra) &&
        !letrasCorrectas.includes(letra) &&
        letrasCorrectas.length < palabraSecreta.length &&
        verificarLetra(e.keyCode)
      ) {
        agregarError(letra);
        console.log(erroresRestantes);
        mostrarLetraIncorrecta(letra, erroresRestantes);
        dibujarAhorcado(erroresRestantes);
        verificarFinDelJuego();
      }
    }
  };
}

//Palabra secreta
function seleccionarPalabraSecreta() {
  let palabra =
    listaDePalabras[Math.floor(Math.random() * listaDePalabras.length)];
    palabraSecreta = palabra;
    console.log(palabraSecreta);
}

//verificar si la tecla que fue presionada es una letra.El método indexOf() devuelve el primer índice en el que se puede encontrar un elemento dado en el array, ó devuelve -1 si el elemento no está presente.
// La sentencia return finaliza la ejecución de la función y especifica un valor para ser devuelto a quien llama a la función.
function verificarTecla(key) {
  let estado = false;
  if (
    (key >= 65 && letrasCorrectas.indexOf(key)) ||
    (key <= 90 && letrasCorrectas.indexOf(key))
  ) {
    console.log(key);
    return estado;
  } else {
    estado = true;
    console.log(key);
    return estado;
  }
}

// Mostrar en pantalla las letras que esten en la palabra secreta
function mostrarLetraCorrecta(index) {
  letrero.font = "bold 38px sans-serif";
  letrero.lineWidth = 5;
  letrero.lineCap = "round";
  letrero.lineJoin = "round";
  letrero.fillStyle = "#0A3871";

  let anchura = 25;
  let posicion = (360 - palabraSecreta.length * 35) * 0.5;

  letrero.beginPath();
  letrero.fillText(palabraSecreta[index], posicion + index * 35, 50, anchura);
  letrero.stroke();
  letrero.closePath();
}

//Mostrar en la pantalla las letras seleccionadas que no estan en la palabra secreta
function mostrarLetraIncorrecta(letra, error) {
  letrero.font = "bold 24px sans-serif";
  letrero.lineWidth = 5;
  letrero.lineCap = "round";
  letrero.lineJoin = "round";
  letrero.fillStyle = "#000000";
  letrero.beginPath();
  if (erroresRestantes >= 0) {
    letrero.fillText(letra, 26 * (9 - error), 90);
    letrero.stroke();
    letrero.closePath();
  }
}

// Almacena los errores y aciertos del jugador
// El método push() añade uno o más elementos al final de un array y devuelve la nueva longitud del array.
function agregarError(letra) {
  erroresRestantes -= 1;
  letrasErroneas.push(letra);
  console.log(letrasErroneas);
}
function agregarAcierto(letra) {
  letrasCorrectas.push(letra);
  console.log(letrasCorrectas);
}

//Evita que las los numeros y otras teclas sean tomados como errores
function verificarLetra(keyCode) {
  if (typeof keyCode === "number" && keyCode >= 65 && keyCode <= 90) {
    return true;
  } else {
    return false;
  }
}

//Verifica cuantos intentos le quedan al jugador
function verificarFinDelJuego() {
  if (erroresRestantes === 0) {
    partidaPerdida();
    for (let i = 0; i < palabraSecreta.length; i++) {
      mostrarLetraCorrecta(i);
    }
  }
}

//Muestra un mensaje emergente cuando el jugador agota el numero de intentos
function partidaPerdida() {
  tablero.font = "bold 18px sans-serif";
  tablero.lineWidth = 5;
  tablero.lineCap = "round";
  tablero.lineJoin = "round";
  tablero.fillStyle = "#ff2208";
  tablero.beginPath();
  tablero.fillText("¡PERDISTE!", 83, 30);
  tablero.stroke();
  tablero.closePath();
}

//Verifica cuantas letras le restan por adivinar al jugador
function verificarGanador() {
  if (letrasCorrectas.length === palabraSecreta.length) {
    escribirVictoria();
  }
}

//Escribe una notificacion al jugador cuando acierta la palabra secreta
function escribirVictoria() {
  tablero.font = "bold 18px sans-serif";
  tablero.lineWidth = 5;
  tablero.lineCap = "round";
  tablero.lineJoin = "round";
  tablero.fillStyle = "#FFFFFF";
  tablero.beginPath();
  tablero.fillText("¡GANASTE!", 123, 50);
  tablero.stroke();
  tablero.closePath();
}

//Guiones de la palabra secreta
function dibujarGuiones() {
  let numeroDeEspacios = palabraSecreta.length;
  let anchura = 25;
  let separacion = 10;
  let posicion = (360 - palabraSecreta.length * 35) * 0.5;

  letrero.lineWidth = 4;
  letrero.lineCap = "round";
  letrero.lineJoin = "round";
  letrero.fillStyle = "#828282";
  letrero.strokeStyle = "#0A3871";

  letrero.fillRect(0, 0, 350, 100);
  letrero.beginPath();
  letrero.moveTo(posicion, 60);
  for (let i = 0; i < numeroDeEspacios; i++) {
    posicion = posicion + anchura;
    letrero.lineTo(posicion, 60);
    letrero.stroke();
    posicion = posicion + separacion;
    letrero.moveTo(posicion, 60);
  }
}
//Dibujar la horca
function dibujarAhorcado(oportunidades) {
  tablero.lineWidth = 6;
  tablero.lineCap = "round";
  tablero.lineJoin = "round";
  tablero.strokeStyle = "#0A3871";

  //Base de la horca
  tablero.beginPath();
  tablero.moveTo(3, 357);
  tablero.lineTo(291, 357);

  //Poste
  tablero.moveTo(75, 357);
  tablero.lineTo(75, 3);
  tablero.lineTo(253, 3);
  tablero.lineTo(253, 45);
  tablero.stroke();

  //dibujar cabeza
  if (oportunidades === 5) {
    tablero.moveTo(288, 80);
    tablero.arc(253, 80, 35, 0, 2 * Math.PI);
  }

  //Abdomen
  if (oportunidades === 4) {
    tablero.moveTo(253, 115);
    tablero.lineTo(253, 250);
  }

  //dibujar Brazo izquierdo
  if (oportunidades === 3) {
    tablero.moveTo(253, 125);
    tablero.lineTo(220, 180);
  }

  //dibujar Brazo derecho
  if (oportunidades === 2) {
    tablero.moveTo(253, 125);
    tablero.lineTo(280, 180);
  }

  //dibujar Pierna izquierda
  if (oportunidades === 1) {
    tablero.moveTo(253, 250);
    tablero.lineTo(220, 305);
  }

  //dibujar Pierna derecha
  if (oportunidades === 0) {
    tablero.moveTo(253, 250);
    tablero.lineTo(286, 305);
  }
  tablero.stroke();
  tablero.closePath();
}
