<script>
  import RouteGuard from "../routes/RouteGuard.svelte";
  import SettingCamera from "../pages/SettingCamera.svelte";
</script>

<RouteGuard requiresAuth>
  <SettingCamera />
</RouteGuard>
