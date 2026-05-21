<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";

  type PagefindResult = {
    id: string;
    data: () => Promise<{
      url: string;
      meta: { title?: string };
      excerpt: string;
    }>;
  };

  type Pagefind = {
    search: (query: string) => Promise<{ results: PagefindResult[] }>;
  };

  type ResolvedResult = {
    id: string;
    url: string;
    title: string;
    excerpt: string;
  };

  let open = $state(false);
  let query = $state("");
  let results = $state<ResolvedResult[]>([]);
  let activeIndex = $state(0);
  let inputEl: HTMLInputElement | null = $state(null);
  let pagefind: Pagefind | null = null;
  let pagefindLoading = false;
  let lastQuery = "";

  const base =
    typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env.BASE_URL as string).replace(/\/$/, "")
      : "";

  async function loadPagefind(): Promise<Pagefind | null> {
    if (pagefind) return pagefind;
    if (pagefindLoading) return null;
    pagefindLoading = true;
    try {
      const url = `${base}/pagefind/pagefind.js`;
      // @vite-ignore — runtime import of static asset; not bundled.
      const mod = await import(/* @vite-ignore */ url);
      pagefind = mod as Pagefind;
      return pagefind;
    } catch (err) {
      console.warn("Pagefind not available:", err);
      return null;
    } finally {
      pagefindLoading = false;
    }
  }

  async function runSearch(q: string) {
    const trimmed = q.trim();
    if (trimmed === lastQuery) return;
    lastQuery = trimmed;
    if (!trimmed) {
      results = [];
      activeIndex = 0;
      return;
    }
    const pf = await loadPagefind();
    if (!pf) {
      results = [];
      return;
    }
    const r = await pf.search(trimmed);
    if (lastQuery !== trimmed) return; // racey input; keep latest.
    const resolved = await Promise.all(
      r.results.slice(0, 10).map(async (item) => {
        const data = await item.data();
        return {
          id: item.id,
          url: data.url,
          title: data.meta.title ?? data.url,
          excerpt: data.excerpt,
        } satisfies ResolvedResult;
      }),
    );
    results = resolved;
    activeIndex = 0;
  }

  $effect(() => {
    runSearch(query);
  });

  async function openModal() {
    open = true;
    await tick();
    inputEl?.focus();
    loadPagefind();
  }

  function closeModal() {
    open = false;
    query = "";
    results = [];
    activeIndex = 0;
  }

  function onKeydown(e: KeyboardEvent) {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === "k") {
      e.preventDefault();
      open ? closeModal() : openModal();
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length) activeIndex = (activeIndex + 1) % results.length;
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length)
        activeIndex = (activeIndex - 1 + results.length) % results.length;
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const r = results[activeIndex];
      if (r) window.location.assign(r.url);
    }
  }

  function onTriggerEvent() {
    openModal();
  }

  onMount(() => {
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("currnt:open-search", onTriggerEvent);
  });

  onDestroy(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("currnt:open-search", onTriggerEvent);
  });
</script>

{#if open}
  <div
    class="search-overlay"
    onclick={(e) => {
      if (e.target === e.currentTarget) closeModal();
    }}
    role="presentation"
  >
    <div class="search-modal" role="dialog" aria-modal="true" aria-label="Search">
      <div class="search-modal__input-row">
        <span class="search-modal__icon" aria-hidden="true">⌕</span>
        <input
          bind:this={inputEl}
          bind:value={query}
          type="search"
          placeholder="Search the site…"
          autocomplete="off"
          spellcheck="false"
          aria-label="Search query"
        />
        <button
          type="button"
          class="search-modal__close"
          onclick={closeModal}
          aria-label="Close search"
        >
          esc
        </button>
      </div>

      {#if query.trim() && results.length === 0}
        <div class="search-modal__empty">No results for &quot;{query}&quot;.</div>
      {/if}

      {#if results.length > 0}
        <ul class="search-modal__results" role="listbox">
          {#each results as r, i (r.id)}
            <li>
              <a
                href={r.url}
                class="search-modal__result"
                class:active={i === activeIndex}
                onmouseenter={() => (activeIndex = i)}
              >
                <span class="search-modal__result-title">{r.title}</span>
                <span class="search-modal__result-excerpt">{@html r.excerpt}</span>
              </a>
            </li>
          {/each}
        </ul>
      {/if}

      <div class="search-modal__hint">
        <kbd>↑</kbd><kbd>↓</kbd> navigate · <kbd>↵</kbd> open ·
        <kbd>esc</kbd> close
      </div>
    </div>
  </div>
{/if}

<style>
  .search-overlay {
    position: fixed;
    inset: 0;
    background: color-mix(in oklab, var(--bg) 70%, transparent);
    backdrop-filter: blur(6px);
    z-index: 100;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 10vh 1rem 1rem;
  }
  .search-modal {
    width: 100%;
    max-width: 640px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .search-modal__input-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--border);
  }
  .search-modal__icon {
    color: var(--fg-muted);
    font-size: 1.1rem;
  }
  .search-modal__input-row input {
    flex: 1;
    appearance: none;
    background: transparent;
    border: 0;
    outline: 0;
    color: var(--fg);
    font-size: 1rem;
    font-family: var(--font-sans);
  }
  .search-modal__close {
    appearance: none;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    color: var(--fg-muted);
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    padding: 0.15rem 0.45rem;
    cursor: pointer;
  }
  .search-modal__empty {
    padding: 1.5rem 1rem;
    color: var(--fg-muted);
    text-align: center;
    font-size: 0.92rem;
  }
  .search-modal__results {
    list-style: none;
    margin: 0;
    padding: 0.4rem;
    max-height: 60vh;
    overflow-y: auto;
  }
  .search-modal__result {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.6rem 0.7rem;
    border-radius: 4px;
    text-decoration: none;
    color: var(--fg);
  }
  .search-modal__result.active {
    background: var(--bg-soft);
  }
  .search-modal__result-title {
    font-weight: 600;
    font-size: 0.95rem;
  }
  .search-modal__result-excerpt {
    font-size: 0.85rem;
    color: var(--fg-soft);
    line-height: 1.45;
  }
  .search-modal__result-excerpt :global(mark) {
    background: color-mix(in oklab, var(--accent) 30%, transparent);
    color: var(--fg);
    padding: 0 0.1em;
    border-radius: 2px;
  }
  .search-modal__hint {
    padding: 0.6rem 1rem;
    border-top: 1px solid var(--border);
    font-size: 0.75rem;
    color: var(--fg-muted);
    font-family: var(--font-mono);
  }
  .search-modal__hint kbd {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--fg-soft);
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 0.05rem 0.3rem;
    margin: 0 0.15rem;
  }
</style>
