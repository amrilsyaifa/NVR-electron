<script>
  import { onMount } from "svelte";
  import Header from "../components/Header.svelte";
  import { apiFetch } from "../lib/api";
  import CameraPlayer from "../components/CameraPlayer.svelte";

  let videoEls = [];

  async function fetchCameras() {
    try {
      const res = await apiFetch("/api/cctvs");
      if (res.ok) {
        const data = await res.json();
        videoEls = data || [];
      } else {
        videoEls = [];
      }
    } catch (err) {
      videoEls = [];
    }
  }

  onMount(() => {
    fetchCameras();
  });
</script>

<Header title="Home" />

<main class="p-6 bg-white min-h-[calc(100vh-64px)]">
  <h1 class="text-3xl font-bold text-blue-800 mb-6">Live CCTV Stream</h1>

  {#if videoEls.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each videoEls as cam}
        <CameraPlayer
          ip={cam.ip}
          title={cam.name}
          username={cam.username}
          password={cam.password}
        />
      {/each}
    </div>
  {:else}
    <div class="text-gray-500 text-lg mt-8">No cameras available.</div>
  {/if}
</main>
