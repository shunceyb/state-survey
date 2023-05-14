<script>
  import { id as idStore, socket } from './stores'
  let id;

  idStore.subscribe(update => {
    id = update
  })

  socket.subscribe((io) => {
    io.on('connect', () => {
      console.log('connected to socket')
      io.emit('identify', id)
    })
    io.on('id', i => {
      idStore.set(i)
    })
  })
  console.log(id)
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
