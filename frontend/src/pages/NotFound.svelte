<script>
  import { push } from "svelte-spa-router";

  function goHome() {
    push("/home");
  }
</script>

<div class="flex flex-col items-center justify-center h-screen">
  <h1 class="text-4xl font-bold text-red-600">404</h1>
  <p class="text-lg mt-2">Halaman tidak ditemukan.</p>
  <button
    class="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    on:click={goHome}
  >
    Kembali ke Home
  </button>
</div>
