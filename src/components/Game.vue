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
      <button @click="downloadResults">Descargar Resultados</button>
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
        // Verificar si el campo de entrada está vacío
        if (!this.inputData.trim()) {
          this.errorMessage = 'Ingresa los datos antes de calcular.';
          return;
        }
        
        const lines = this.inputData.trim().split('\n');
        const numRounds = parseInt(lines[0]);
        const roundsData = lines.slice(1); // Obtener las líneas de los datos de las rondas
        const rounds = [];
        let player1Total = 0;
        let player2Total = 0;
        let leaderMargin = 0;

        // Limpiar mensajes de error al comenzar el cálculo
        this.errorMessage = '';

        if (numRounds !== roundsData.length) {
          // Verificar si el número de rondas especificado no coincide con la cantidad real de rondas
          this.errorMessage = `El número de rondas especificado (${numRounds}) no coincide con la cantidad de rondas proporcionadas (${roundsData.length}).`;
          return; // Salir del cálculo si hay un error
        }

        for (let i = 0; i < numRounds; i++) {
          // Utilizar una expresión regular actualizada para validar el formato de la línea
          const line = roundsData[i].trim();
          const values = line.split(/\s+/).map(Number);

          if (values.length !== 2) {
            // Verificar si la línea no contiene exactamente 2 valores
            this.errorMessage = `Deben de ser exactamente 2 jugadores.`;
            return; // Salir del cálculo si hay un error
          }

          if (values.some(value => value < 0)) {
            // Verificar si alguno de los valores es negativo
            this.errorMessage = `Los números negativos no están permitidos en la línea ${i + 2}.`;
            return; // Salir del cálculo si hay un error
          }

          const [player1Str, player2Str] = values;
          const player1 = Number(player1Str);
          const player2 = Number(player2Str);

          if (isNaN(player1) || isNaN(player2)) {
            // Verificar si alguno de los valores no es un número válido
            this.errorMessage = `Los valores deben ser numericos`;
            return; // Salir del cálculo si hay un error de conversión
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
        // Obtén el contenido del archivo de texto
        const fileContent = this.generateResultsFileContent();

        // Crea un Blob con el contenido y establece el tipo de archivo
        const blob = new Blob([fileContent], { type: 'text/plain' });

        // Crea una URL para el Blob
        const url = window.URL.createObjectURL(blob);

        // Crea un enlace de descarga y simula un clic para descargar el archivo
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'resultados.txt';
        document.body.appendChild(a);
        a.click();

        // Libera la URL creada para el Blob
        window.URL.revokeObjectURL(url);
      },
    },
};
</script>
<style scoped>
    /* Estilos para el contenedor principal */
  div {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  /* Estilos para el título */
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  /* Estilos para el textarea */
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  /* Estilos para el botón */
  button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 16px;
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

  /* Estilos para la tabla */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  /* Estilos para las celdas de la tabla */
  th, td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
  }

  /* Estilos para el mensaje del ganador */
  .winner-message {
    background-color: #4caf50;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 16px;
  }

  /* Estilos para el mensaje de error */
  .error-message {
     background-color: #f44336;
     color: #fff;
     padding: 10px;
     border-radius: 4px;
     margin-bottom: 16px;
   }
</style>