
// Definimos el displayValue que almacenara el contenido que se mostrara en la pantalla
let displayValue = '';

// Esta funcion se ejecutara cuando se aprete algun numero numerico
function appendNumber(number) {
    // El numero seleccionado se ira al final de lo guardado en la variable
  displayValue += number;
  document.getElementById('display').textContent = displayValue;
}
// Esta funcion se ejecutara cuando se aprete algun operador
function appendOperator(operator) {
  displayValue += operator;
  document.getElementById('display').textContent = displayValue;
}
// Esta funcion se ejecutara cuando se aprete el boton de borrar
function clearDisplay() {
    // Borra el contenido, por lo tanto cualquier cosa que este no existe mas
  displayValue = '';
  document.getElementById('display').textContent = displayValue;
}

//Se ejecuta cuando se aprete el boton =
function calculate() {
    //Hacemos el intento de resolver en caso de que se pueda se ejecuta
  try {
    //realizamos el eval y lo mostramos en pantalla
    const result = eval(displayValue);
    displayValue = result;
    document.getElementById('display').textContent = displayValue;
    //En caso de no poder ejecuta el error
  } catch (error) {
    displayValue = 'Error';
    document.getElementById('display').textContent = displayValue;
  }
}