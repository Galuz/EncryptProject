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
        <div v-if="showResult" class="results">
            <h2>Resultado:</h2>
            <p>Primera Instrucción: {{ result.instruction1  }}</p>
            <p>Segunda Instrucción: {{ result.instruction2  }}</p>
        </div>
        <button @click="downloadResults" :disabled="!showResult">Descargar Resultados</button>
        <div v-if="error" class="alert">
          <p>{{ error }}</p>
        </div>
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
      const lines = (this.inputText as string).split("\n");
      // Check if there are exactly 4 lines in the input text.
      if (lines.length !== 4) {
        this.error = 'El texto de entrada debe contener exactamente 4 líneas.';
        return;
      }
       // To verify that the first line contains exactly 3 numbers.
      const firstLineParts = lines[0].split(" ");
      if (firstLineParts.length !== 3 || !firstLineParts.every(part => /^\d+$/.test(part))) {
        this.error = 'La primera línea debe contener exactamente 3 números separados por espacios.';
        return;
      }
      // Read values of M1, M2, and N from the first line
      const [M1, M2, N] = lines[0].split(" ").map(Number);
      // Read instructions and the message from the following lines
      const instruction1 = lines[1];
      const instruction2 = lines[2];
      const message = lines[3];

      if (this.isValidFile(message, instruction1, instruction2, N, M1, M2)) {
        // Verify if the instructions are hidden in the message
        const instruction1Found = this.verificarInstruccion(instruction1, message, M1);
        const instruction2Found = this.verificarInstruccion(instruction2, message, M2);

        // Check if both instructions are found
        if (instruction1Found && instruction2Found) {
          this.error = "Se encontraron ambas instrucciones en el mensaje. Debe haber solo una instrucción oculta.";
        } else if (!instruction1Found && !instruction2Found) {
          this.error = "No se encontró ninguna instrucción oculta.";
        } else {
          this.result = {
            instruction1: instruction1Found ? "SI" : "NO",
            instruction2: instruction2Found ? "SI" : "NO",
          };
          this.showResult = true;
        }
      }
    },
    verificarInstruccion(instruction: String, message: String, instructionLength: number) {
      // Search for the instruction in the message
      let i = 0;
      for (let j = 0; j < message.length; j++) {
        if (instruction[i] === message[j]) {
          i++;
          if (i === instructionLength) {
            return true;
          }
        }
      }
      return false;
    },
    isValidFile(message:string, instruction1:string, instruction2:string, longMessage:number, longInst1:number, longInst2:number) {
      if (instruction1.length !== longInst1) {
        this.error = 'La longitud de la instrucción 1 no coincide con la línea de encabezado.';
        return false;
      }
      if (instruction2.length !== longInst2) {
        this.error = 'La longitud de la instrucción 2 no coincide con la línea de encabezado.';
        return false;
      }
      if (message.length !== longMessage) {
        this.error = 'La longitud del mensaje no coincide con la línea de encabezado.';
        return false;
      }
      if (/(.)\1{1,}/.test(message)) {
        this.error = 'El mensaje contiene caracteres duplicados o triplicados.';
        return false;
      }
      if(!isValidAlphanumeric(instruction1) || !isValidAlphanumeric(instruction2) || !isValidAlphanumeric(message)){
        this.error = 'El mensaje o instruccion solo puede contener caracteres alfanuméricos (a-zA-Z0-9).';
        return false;
      }
      if (instruction1.length < 2 || instruction1.length > 50 || instruction2.length < 2 || instruction2.length > 50) {
        this.error = 'La longitud de la instrucción no es la adecuada, debe ser mayor a 2 o menor de 50';
        return false;
      }
      if(message.length < 3 || message.length > 5000){
        this.error = 'La longitud del mensaje no es la adecuada, deberia ser mayor a 3 o menor de 5000';
        return false;
      }
      function isValidAlphanumeric(instruction:string) {
        return /^[a-zA-Z0-9]+$/.test(instruction);
      }
      return true;
    },
    cleanError() {
      this.error = ""; // Reset the error message to an empty value
    },
    downloadResults() {
      if (!this.result) {
        return;
      }
      // Create the content of the results file.
      const content = `Primera Instrucción: ${this.result.instruction1}\nSegunda Instrucción: ${this.result.instruction2}`;

      // Create a Blob object with the text content.
      const blob = new Blob([content], { type: "text/plain" });

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a download link element.
      const a = document.createElement("a");
      a.href = url;
      a.download = "resultados.txt"; // Output file name.
      document.body.appendChild(a);

      // Simulate a click on the link to initiate the download.
      a.click();

      // Release the URL of the Blob.
      window.URL.revokeObjectURL(url);
    },
  },
};
</script>
<style scoped>
/* Style for the main container */
div {
    padding: 20px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
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

  button:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
  
  /* Style for the "Select file" input */
  input[type="file"] {
    margin-top: 10px;
  }

  /* Style for the result */
  h2 {
    font-size: 20px;
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

  .results{
    background-color: #4caf50;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  /* Style for alert messages */
  .alert {
    background-color: #f44336;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    margin-top: 16px;
    margin-bottom: 16px;
  } 
</style>