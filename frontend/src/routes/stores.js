import { writable } from "svelte/store";
import { browser } from "$app/environment";


const id = writable(browser && localStorage.getItem('id') || null)

id.subscribe(update => {
  browser && localStorage.setItem('id', update)
})

export { id }