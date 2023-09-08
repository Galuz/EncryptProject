<template lang="">
    <div>
        <div>
          <h1>Verificación de Instrucciones</h1>
          <textarea v-model="inputText" placeholder="Ingrese la entrada aquí"></textarea>
          <button @click="procesarEntrada">Procesar</button>
        </div>
        <div>
          <input type="file" @change="cargarArchivo">
        </div>
        <div v-if="resultado">
            <h2>Resultado:</h2>
            <p>Primera Instrucción: {{ resultado.instruccion1 }}</p>
            <p>Segunda Instrucción: {{ resultado.instruccion2 }}</p>
        </div>
    </div>
</template>
<script lang="ts">
export default {
  data() {
    return {
      inputText: "",
      resultado: null,
    };
  },
  methods: {
    cargarArchivo(event) {
      const archivo = event.target.files[0];
      if (archivo) {
        const lector = new FileReader();
        lector.onload = (e) => {
          this.inputText = e.target.result; // Asignar el contenido del archivo a inputText
        };
        lector.readAsText(archivo);
      }
    },
    procesarEntrada() {
      // Dividir el texto de entrada en líneas
      const lineas = this.inputText.split("\n");
      console.log("Líneas de entrada:", lineas);
      if (lineas.length !== 4) {
        alert("La entrada debe tener exactamente cuatro líneas.");
        return;
      }

      // Leer los valores de M1, M2 y N desde la primera línea
      const [M1, M2, N] = lineas[0].split(" ").map(Number);
    console.log("M1:", M1);
    console.log("M2:", M2);
    console.log("N:", N);
      // Validar que N esté dentro del rango especificado (entre 3 y 5000)
      if (N < 3 || N > 5000) {
        alert("El valor de N debe estar entre 3 y 5000.");
        return;
      }

      // Leer las instrucciones y el mensaje de las siguientes líneas
      const instruccion1 = lineas[1];
      const instruccion2 = lineas[2];
      const mensaje = lineas[3];
      console.log("Instrucción 1:", instruccion1);
      console.log("Instrucción 2:", instruccion2);
      console.log("Mensaje:", mensaje);

      // Verificar si las instrucciones están escondidas en el mensaje
      const instruccion1Encontrada = this.verificarInstruccion(instruccion1, mensaje, M1);
      const instruccion2Encontrada = this.verificarInstruccion(instruccion2, mensaje, M2);

      // Actualizar el resultado
      this.resultado = {
        instruccion1: instruccion1Encontrada ? "SI" : "NO",
        instruccion2: instruccion2Encontrada ? "SI" : "NO",
      };
    },
    verificarInstruccion(instruccion, mensaje, longitudInstruccion) {
    // Buscar la instrucción en el mensaje permitiendo repeticiones
    let i = 0;
    for (let j = 0; j < mensaje.length; j++) {
        if (instruccion[i] === mensaje[j]) {
            i++;
            if (i === longitudInstruccion) {
                // Verificar si la combinación no contiene dos letras iguales seguidas
                if (!instruccion.match(/(.)\1+/)) {
                    return true;
                }
            }
        }
    }
    return false;
    },
    generarCombinaciones(mensaje) {
    // Generar combinaciones del mensaje con repetición
    const combinaciones = [];
    for (let i = 0; i < mensaje.length; i++) {
        for (let j = i + 1; j <= mensaje.length; j++) {
            const subcadena = mensaje.slice(i, j);
            // Verificar si la subcadena no contiene dos letras iguales seguidas
            if (!subcadena.match(/(.)\1+/)) {
                combinaciones.push(subcadena);
            }
        }
    }
    return combinaciones;
    },  
  },
};
</script>
<style scoped>
textarea {
    width: 100%;
    height: 100px;
}   
</style>