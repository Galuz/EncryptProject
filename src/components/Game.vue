<template>
    <div>
      <h1>Resultado del Juego</h1>
      <textarea v-model="inputData" placeholder="Ingresa los datos aquí"></textarea>
      <div class="buttons-wrapper">
        <button @click="calculateWinner">Calcular Ganador</button>
        <input type="file" @change="loadFile">
      </div>
      <table>
        <thead>
          <tr>
            <th>Ronda</th>
            <th>Jugador 1</th>
            <th>Jugador 2</th>
            <th>Líder</th>
            <th>Ventaja</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(round, index) in rounds" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ round.player1 }}</td>
            <td>{{ round.player2 }}</td>
            <td>{{ round.leader }}</td>
            <td>{{ round.margin }}</td>
          </tr>
        </tbody>
      </table>
      <button @click="downloadResults" :disabled="!winner">Descargar Resultados</button>
      <!-- Agregar un mensaje de error -->
      <div v-if="errorMessage" class="error-message">
          <p>{{ errorMessage }}</p>
      </div>
       <!-- winner -->
      <div v-if="winner" class="winner-message">
        <p>El ganador es el Jugador {{ winner.player }} con una ventaja de {{ winner.margin }}.</p>
      </div>
    </div>
  </template>
  
<script lang="ts">
export default {
    data() {
    return {
        inputData: '',
        rounds: [] as { player1: number; player2: number; leader: string; margin: number }[],
        winner: null as { player: number; margin: number } | null,
        errorMessage: '',
    };
    },
    methods: {
      loadFile(event: Event) {
        const file  = (event.target as HTMLInputElement).files?.[0];
        if (file ) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.inputData = e.target?.result as string;
          };
          reader.readAsText(file);
        } else {
          this.inputData = "";
        }
      },
      calculateWinner() {
        this.winner=null;
        // Check if the input field is empty.
        if (!this.inputData.trim()) {
          this.errorMessage = 'Ingresa los datos antes de calcular.';
          return;
        }
        
        const lines = this.inputData.trim().split('\n');
        const numRounds = parseInt(lines[0]);
        const roundsData = lines.slice(1); // Retrieve the lines of data from the rounds.
        const rounds = [];
        let player1Total = 0;
        let player2Total = 0;
        let leaderMargin = 0;

        // Clear error messages when starting the calculation.
        this.errorMessage = '';

        if (numRounds !== roundsData.length) {
          // Check if the specified number of rounds does not match the actual quantity of rounds.
          this.errorMessage = `El número de rondas especificado (${numRounds}) no coincide con la cantidad de rondas proporcionadas (${roundsData.length}).`;
          return; // Exit the calculation if there is an error.
        }

        for (let i = 0; i < numRounds; i++) {
          // Use an updated regular expression to validate the format of the line.
          const line = roundsData[i].trim();
          const values = line.split(/\s+/).map(Number);

          if (values.length !== 2) {
            // Check if the line does not contain exactly 2 values.
            this.errorMessage = `Deben de ser exactamente 2 jugadores.`;
            return;
          }

          if (values.some(value => value < 0)) {
            // Check if any of the values is negative.
            this.errorMessage = `Los números negativos no están permitidos en la línea ${i + 2}.`;
            return;
          }

          const [player1Str, player2Str] = values;
          const player1 = Number(player1Str);
          const player2 = Number(player2Str);

          if (isNaN(player1) || isNaN(player2)) {
            // Check if any of the values is not a valid number.
            this.errorMessage = `Los valores deben ser numericos`;
            return;
          }

          player1Total += player1;
          player2Total += player2;
          const leader = player1Total - player2Total;
          const currentLeader = leader > 0 ? 1 : 2;
          const margin = Math.abs(leader);

          rounds.push({
            player1: player1Total,
            player2: player2Total,
            leader: `Jugador ${currentLeader}`,
            margin,
          });

          if (margin > leaderMargin) {
            leaderMargin = margin;
            this.winner = { player: currentLeader, margin };
          }
        }

        this.rounds = rounds;
      },

      generateResultsFileContent(): string {
        if (!this.winner) {
          return 'No hay ganador.';
        }

        return `El ganador es el Jugador ${this.winner.player} con una ventaja de ${this.winner.margin}.`;
      },

      downloadResults() {
        // Retrieve the content of the text file.
        const fileContent = this.generateResultsFileContent();

        // Create a Blob object with the text content.
        const blob = new Blob([fileContent], { type: 'text/plain' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a download link element.
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'resultados.txt';
        document.body.appendChild(a);
        a.click();

        // Release the URL of the Blob.
        window.URL.revokeObjectURL(url);
      },
    },
};
</script>
<style scoped>
  div {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 16px;
  }

  button:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
  .buttons-wrapper{
    display:flex;
    padding: 0;
    margin-bottom: 16px;
  }
  .buttons-wrapper button{
    margin: auto auto auto 0;
  }
  .buttons-wrapper input{
    margin: auto 0 auto auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
  }
  .winner-message {
    background-color: #4caf50;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  .error-message {
     background-color: #f44336;
     color: #fff;
     padding: 10px;
     border-radius: 4px;
     margin-bottom: 16px;
   }
</style>