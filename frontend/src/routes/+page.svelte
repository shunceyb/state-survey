<script>
    import { onMount } from 'svelte';
  import { id as idStore } from './stores'
  import { io } from './socket'
  let id;
  let connected;
  let clue = 'loading...'
  let checked = 1

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
    io.on('clue', (c) => clue = c)
  })
  console.log(connected)
</script>

<div id="main">
  {#if connected}
  <p id="clue"><strong>Clue: {clue}</strong></p>
    <div id="guess-cont">
      <input type="text" id="guess" autocomplete="off" placeholder="Guess">
      <button id="guess-btn">Guess</button>
    </div>
    <div id="diff-selector-container">
      {#each [1, 2, 3, 4] as i}
      <a class="diff {(checked && i <= checked) ? 'checked' : ''}" id="{i}" on:click={handleCheck} tabindex="1">{i}</a>
        <!-- <input type="radio" class="diff "   name="checked-diff"> -->
      {/each}
    </div>
  {:else}
    Connecting To Server, please wait.
  {/if}
</div>    

<style>
  #main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: #b2eddd;
  }
  .diff {
    margin: 0px 10px;
    padding: 8px 12px;
    border-radius: 4px;
    /* width: 1em;
    height: 1em; */
    /* text-align: center; */
    cursor: default;
    /* vertical-align: middle; */
  }
  .checked {
    background-color: #d496e3;
  }
  .diff:hover {
    background-color: #d496e3;
  }
  #clue {
    margin: 10px 0;
    padding: 0;
    font-size: 14pt;
  }
  #guess {
    font-size: 16pt;
    border-radius: 5px 0px 0px 5px;
    border-color: transparent;
  }
  #diff-selector-container {
    display: flex;
    margin: 10px 0;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  #guess-cont {
    display: flex;
  }
  #guess {
    text-align: center;
  }
  #guess-btn {
    background-color: white;
    border-radius: 0px 5px 5px 0px;
    border-color: transparent;
  }
</style>