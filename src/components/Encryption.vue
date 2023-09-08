<template lang="">
    <div>
        <div>
          <h1>Verificación de Instrucciones</h1>
          <textarea v-model="inputText" placeholder="Ingrese la entrada aquí"  @input="cleanError"></textarea>
          <button @click="processInput">Procesar</button>
        </div>
        <div>
          <input type="file" @change="loadFile">
        </div>
        <div v-if="showResult">
            <h2>Resultado:</h2>
            <p>Primera Instrucción: {{ result.instruction1  }}</p>
            <p>Segunda Instrucción: {{ result.instruction2  }}</p>
        </div>
        <p class="alert" v-if="error">{{ error }}</p>
    </div>
</template>
<script lang="ts">
export default {
  data() {
    return {
      inputText: null as string | null,
      result: null as { instruction1: string, instruction2: string } | null,
      error: "",
      showResult: false,
    };
  },
  methods: {
    loadFile(event: Event) {
      const file  = (event.target as HTMLInputElement).files?.[0];
      if (file ) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.inputText = e.target?.result as string;
          this.cleanError();
        };
        reader.readAsText(file);
      } else {
        this.inputText = "";
        this.cleanError();
      }
    },
    processInput() {
      this.showResult = false;
      if (!this.inputText) {
        this.error = "El texto de entrada está vacío.";
        return;
      }

      // Dividir el texto de entrada en líneas
      const lines = (this.inputText as string).split("\n");
      if (lines.length !== 4) {
        this.error = "La entrada debe tener exactamente cuatro líneas."
        return;
      }

      // Leer los valores de M1, M2 y N desde la primera línea
      const [M1, M2, N] = lines[0].split(" ").map(Number);
      // Validar que N esté dentro del rango especificado (entre 3 y 5000)
      if (N < 3 || N > 5000) {
        this.error = "El valor de N debe estar entre 3 y 5000."
        return;
      }

      // Leer las instrucciones y el mensaje de las siguientes líneas
      const instruction1 = lines[1];
      const instruction2 = lines[2];
      const message = lines[3];

      // Verificar si las instrucciones están escondidas en el mensaje
      const instruction1Found = this.verificarInstruccion(instruction1, message, M1);
      const instruction2Found = this.verificarInstruccion(instruction2, message, M2);

      // Actualizar el resultado
      this.result = {
        instruction1: instruction1Found ? "SI" : "NO",
        instruction2: instruction2Found ? "SI" : "NO",
      };
      this.cleanError();
      this.showResult = true;
    },
    verificarInstruccion(instruction: String, message: String, instructionLength: number) {
    // Buscar la instrucción en el mensaje permitiendo repeticiones
    let i = 0;
    for (let j = 0; j < message.length; j++) {
        if (instruction[i] === message[j]) {
            i++;
            if (i === instructionLength) {
                // Verificar si la combinación no contiene dos letras iguales seguidas
                if (!instruction.match(/(.)\1+/)) {
                    return true;
                }
            }
        }
    }
    return false;
    },
    cleanError() {
      this.error = ""; // Restablecer el mensaje de error a un valor vacío
    },
  },
};
</script>
<style scoped>
/* Estilo para el contenedor principal */
div {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    border-radius: 5px;
  }

  /* Estilo para el título */
  h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }

  /* Estilo para el botón "Procesar" */
  button {
    background-color: #007BFF;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  /* Estilo para el botón "Seleccionar archivo" */
  input[type="file"] {
    margin-top: 10px;
  }

  /* Estilo para el resultado */
  h2 {
    font-size: 20px;
    margin-top: 20px;
  }

  p {
    font-size: 16px;
    margin: 5px 0;
  }

  /* Estilo para el textarea */
  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  /* Estilo para mensajes de alerta */
  .alert {
    text-align: center;
    color: #ff0000;
    margin-top: 10px;
  } 
</style>