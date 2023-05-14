import { writable } from "svelte/store";
import socket from 'socket.io-client'
import { browser } from "$app/environment";

const io = writable(socket('http://localhost:3000'))
const id = writable(browser && localStorage.getItem('id') || null)

id.subscribe(update => {
  browser && localStorage.setItem('id', update)
})

export { id, io as socket }