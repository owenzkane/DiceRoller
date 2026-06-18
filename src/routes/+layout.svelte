<script>
  let { children } = $props();
</script>

{@render children()}

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }

  :global(body) {
    font-family: 'Segoe UI', sans-serif;
    background: #1a1a2e;
    color: #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 40px 20px;
  }

  :global(a) { text-decoration: none; }
</style>
