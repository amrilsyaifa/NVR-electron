<script>
  import {
    Camera,
    Settings,
    HardDrive,
    PlayCircle,
    Download,
    Wrench,
    Video,
    Sliders,
    RefreshCcw,
    // @ts-ignore
  } from "@lucide/svelte";
  import { push } from "svelte-spa-router";
  import Header from "../components/Header.svelte";

  const menus = [
    { label: "Playback", icon: PlayCircle, path: "/settings/playback" },
    { label: "Export", icon: Download, path: "/settings/export" },
    { label: "Manual", icon: Wrench, path: "/settings/manual" },
    { label: "HDD", icon: HardDrive, path: "/settings/hdd" },
    { label: "Record", icon: Video, path: "/settings/record" },
    { label: "Camera", icon: Camera, path: "/settings/camera" },
    { label: "Configuration", icon: Sliders, path: "/settings/configuration" },
    { label: "Maintenance", icon: RefreshCcw, path: "/settings/maintenance" },
  ];

  function navigateTo(path) {
    push(path);
  }
</script>

<Header title="Setting" />
<main class="p-6 bg-white min-h-screen">
  <h1 class="text-3xl font-bold text-blue-800 mb-6">Settings</h1>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
    {#each menus as menu}
      <button
        on:click={() => navigateTo(menu.path)}
        class="cursor-pointer flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition shadow group"
      >
        <svelte:component
          this={menu.icon}
          class="w-10 h-10 text-blue-600 group-hover:text-blue-800 mb-3"
        />
        <span class="text-blue-700 font-semibold">{menu.label}</span>
      </button>
    {/each}
  </div>
</main>
