<script>
  import { push } from "svelte-spa-router";
  import { isAuthenticated } from "../stores/auth.js";
  export let requiresAuth = false;
  export let requiresGuest = false;

  $: if (requiresAuth && !$isAuthenticated) {
    push("/login");
  } else if (requiresGuest && $isAuthenticated) {
    push("/home");
  }
</script>

<slot />
