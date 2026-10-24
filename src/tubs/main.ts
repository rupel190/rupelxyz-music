import { mount } from 'svelte'
import Demo from './Demo.svelte'

const app = mount(Demo, {
  target: document.getElementById('demo')!,
})

export default app
