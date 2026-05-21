<script lang="ts">
  import { onMount } from "svelte";

  let dark = $state(false);
  let mounted = $state(false);

  onMount(() => {
    dark = document.documentElement.classList.contains("dark");
    mounted = true;
  });

  function toggle() {
    dark = !dark;
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }
</script>

<button
  type="button"
  class="theme-toggle"
  aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
  aria-pressed={dark}
  onclick={toggle}
>
  {#if !mounted}
    <span class="icon" aria-hidden="true">○</span>
  {:else if dark}
    <span class="icon" aria-hidden="true">☾</span>
  {:else}
    <span class="icon" aria-hidden="true">☀</span>
  {/if}
</button>

<style>
  .theme-toggle {
    appearance: none;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--fg-soft);
    width: 2rem;
    height: 2rem;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    line-height: 1;
    transition: color 120ms ease, border-color 120ms ease, background 120ms ease;
  }
  .theme-toggle:hover {
    color: var(--fg);
    border-color: var(--fg-muted);
  }
  .icon {
    display: inline-block;
  }
</style>
