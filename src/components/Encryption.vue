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

      // Split input text into lines
      const lines = (this.inputText as string).split("\n");
      if (lines.length !== 4) {
        this.error = "La entrada debe tener exactamente cuatro líneas."
        return;
      }

      // Read values of M1, M2, and N from the first line
      const [M1, M2, N] = lines[0].split(" ").map(Number);
      // Validate that N is within the specified range (between 3 and 5000)
      if (N < 3 || N > 5000) {
        this.error = "El valor de N debe estar entre 3 y 5000."
        return;
      }

      // Read instructions and the message from the following lines
      const instruction1 = lines[1];
      const instruction2 = lines[2];
      const message = lines[3];

      // Verify if the instructions are hidden in the message
      const instruction1Found = this.verificarInstruccion(instruction1, message, M1);
      const instruction2Found = this.verificarInstruccion(instruction2, message, M2);

      // Update the result
      this.result = {
        instruction1: instruction1Found ? "SI" : "NO",
        instruction2: instruction2Found ? "SI" : "NO",
      };
      this.cleanError();
      this.showResult = true;
    },
    verificarInstruccion(instruction: String, message: String, instructionLength: number) {
    // Search for the instruction in the message allowing repetitions
    let i = 0;
    for (let j = 0; j < message.length; j++) {
        if (instruction[i] === message[j]) {
            i++;
            if (i === instructionLength) {
                // Verify if the combination doesn't contain two consecutive identical letters
                if (!instruction.match(/(.)\1+/)) {
                    return true;
                }
            }
        }
    }
    return false;
    },
    cleanError() {
      this.error = ""; // Reset the error message to an empty value
    },
  },
};
</script>
<style scoped>
/* Style for the main container */
div {
    margin: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    border-radius: 5px;
  }

  /* Style for the title */
  h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }

  /* Style for the "Process" button */
  button {
    background-color: #007BFF;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  /* Style for the "Select file" input */
  input[type="file"] {
    margin-top: 10px;
  }

  /* Style for the result */
  h2 {
    font-size: 20px;
    margin-top: 20px;
  }

  p {
    font-size: 16px;
    margin: 5px 0;
  }

  /* Style for the textarea */
  textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  /* Style for alert messages */
  .alert {
    text-align: center;
    color: #ff0000;
    margin-top: 10px;
  } 
</style>