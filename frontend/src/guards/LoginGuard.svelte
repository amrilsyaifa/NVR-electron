<script>
  import RouteGuard from "../routes/RouteGuard.svelte";
  import Login from "../pages/Login.svelte";
</script>

<RouteGuard requiresGuest>
  <Login />
</RouteGuard>
