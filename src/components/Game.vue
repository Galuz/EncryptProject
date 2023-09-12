<template>
    <div>
      <h1>Resultado del Juego</h1>
      
      <textarea v-model="inputData" placeholder="Ingresa los datos aquí"></textarea>
      
      <button @click="calculateWinner">Calcular Ganador</button>
      
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
  
      <!-- Agregar un mensaje de error -->
      <div v-if="errorMessage">
          <p>{{ errorMessage }}</p>
      </div>
       <!-- winner -->
      <div v-if="winner">
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
      calculateWinner() {
        const lines = this.inputData.trim().split('\n');
        console.log(lines);
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
          const [player1, player2] = line.split(/\s+/).map(Number);

          if (player1 < 0 || player2 < 0) {
            // Verificar si alguno de los números es negativo
            this.errorMessage = `Los números negativos no están permitidos en la línea ${i + 2}.`;
            return; // Salir del cálculo si hay un error
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

  /* Estilos para la fila del ganador */
  .winner-row {
    background-color: #4caf50;
    color: #fff;
  }

  /* Estilos para el mensaje del ganador */
  .winner-message {
    font-weight: bold;
    font-size: 18px;
    margin-top: 20px;
  }
</style>