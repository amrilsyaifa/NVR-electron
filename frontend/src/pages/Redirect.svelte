<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  export let to = "/home";

  onMount(() => {
    push(to);
  });
</script>

<p>Redirecting...</p>
