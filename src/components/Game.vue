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
      
      <div v-if="winner">
        <p>El ganador es el Jugador {{ winner.player }} con una ventaja de {{ winner.margin }}.</p>
      </div>
    </div>
  </template>
  
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
    return {
        inputData: '',
        rounds: [],
        winner: null,
    };
    },
    methods: {
    calculateWinner() {
        const lines = this.inputData.trim().split('\n');
        const numRounds = parseInt(lines[0]);
        const rounds = [];
        let player1Total = 0;
        let player2Total = 0;
        let leaderMargin = 0;

        for (let i = 1; i <= numRounds; i++) {
        const [player1, player2] = lines[i].split(' ').map(Number);

        console.log(`Ronda ${i}: Jugador 1 = ${player1}, Jugador 2 = ${player2}`);
        
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
});
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