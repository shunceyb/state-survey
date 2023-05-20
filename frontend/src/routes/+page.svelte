<script>
    import { onMount } from 'svelte';
  import { id as idStore } from './stores'
  import { io } from './socket'
  let id;
  let connected;
  let clue;
  let checked = null;

  idStore.subscribe(update => {
    id = update
  })

  function handleCheck(e) {
    checked = e.target.id;
    console.log(checked)
  }

  onMount(() => {
    connected = io.connected
    io.on('connect', () => {
      connected = true
      console.log('connected to socket')
      io.emit('identify', id)
    })
    io.on('id', i => {
      idStore.set(i)
    })
    io.on('disconnect', () => {
      connected = false
    })
  })
  console.log(connected)
</script>

<div id="root">
  <div id="main">
    {#if connected}
      <p>Clue: {clue}</p>
      <input type="text" id="guess">
      <div id="diff-selector-container">
        {#each [1, 2, 3, 4] as i}
        <button class="diff {(checked && i <= checked) ? 'checked' : ''}" id="{i}" on:click|preventDefault={handleCheck}>{i}</button>
          <!-- <input type="radio" class="diff "   name="checked-diff"> -->
        {/each}
      </div>
    {:else}
      Connecting
    {/if}
  </div>    
</div>

<style>
  #root {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 1vw;
    min-height: 1vh;
  }
  .diff {
    border-color: transparent;
    border-radius: 3px;
  }
  .checked {
    background-color: aquamarine;
  }
  .diff:hover {
    background-color: aquamarine;
  }
</style>