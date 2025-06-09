<script>
  import RouteGuard from "../routes/RouteGuard.svelte";
  import Setting from "../pages/Setting.svelte";
</script>

<RouteGuard requiresAuth>
  <Setting />
</RouteGuard>
