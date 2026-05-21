<script lang="ts">
  // Placeholder trigger; the real search modal lands in US-011.
  // Keeping the slot in the header so the layout doesn't reshuffle later.
  let mac = $state(false);
  if (typeof navigator !== "undefined") {
    mac = /Mac|iPhone|iPod|iPad/.test(navigator.platform);
  }

  function open() {
    // US-011 will wire this to the SearchModal.
    const evt = new CustomEvent("currnt:open-search");
    window.dispatchEvent(evt);
  }
</script>

<button
  type="button"
  class="search-trigger"
  onclick={open}
  aria-label="Open search (Cmd+K)"
>
  <span class="search-trigger__icon" aria-hidden="true">⌕</span>
  <span class="search-trigger__label">Search</span>
  <kbd class="search-trigger__kbd">{mac ? "⌘" : "Ctrl"} K</kbd>
</button>

<style>
  .search-trigger {
    appearance: none;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--fg-soft);
    height: 2rem;
    padding: 0 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    font-family: var(--font-sans);
    transition: color 120ms ease, border-color 120ms ease;
  }
  .search-trigger:hover {
    color: var(--fg);
    border-color: var(--fg-muted);
  }
  .search-trigger__icon {
    font-size: 1rem;
    line-height: 1;
  }
  .search-trigger__kbd {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--fg-muted);
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 0.05rem 0.3rem;
  }
  @media (max-width: 640px) {
    .search-trigger__label,
    .search-trigger__kbd {
      display: none;
    }
    .search-trigger {
      width: 2rem;
      padding: 0;
      justify-content: center;
    }
  }
</style>
