<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  export let ip: string;
  export let username: string;
  export let password: string;
  export let title: string;
  let videoEl: HTMLVideoElement;
  let player: any;

  onMount(() => {
    import("mpegts.js").then((mpegts) => {
      if (mpegts.default.getFeatureList().mseLivePlayback) {
        player = mpegts.default.createPlayer({
          type: "mpegts",
          isLive: true,
          url: `ws://localhost:8000/stream?ip=${ip}&username=${username}&password=${password}`,
        });

        player.attachMediaElement(videoEl);
        player.load();
        player.play();
      } else {
        alert("Browser not supported for live stream.");
      }
    });
  });

  onDestroy(() => {
    if (player) {
      player.destroy();
    }
  });
</script>

<div class="camera-player">
  <h2 class="text-lg font-semibold text-blue-700">{title}</h2>
  <video
    bind:this={videoEl}
    autoplay
    muted
    playsinline
    controls
    class="w-full aspect-video bg-black rounded shadow-md"
  ></video>
</div>
