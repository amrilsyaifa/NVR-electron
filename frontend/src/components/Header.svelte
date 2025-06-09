<script>
  import { onMount } from "svelte";
  import { logout } from "../stores/auth";
  import { getCookie } from "../helpers/cookie";
  import { push } from "svelte-spa-router";

  export let title = "";
  let isLoggedIn = false;

  let drawerOpen = false;

  function toggleDrawer() {
    drawerOpen = !drawerOpen;
  }

  function navigateTo(path) {
    drawerOpen = false;
    push(path);
  }

  function handleLogout() {
    logout();
    push("/home");
    isLoggedIn = false;
  }

  onMount(() => {
    isLoggedIn = !!getCookie("token");
  });
</script>

<header
  class="flex items-center p-4 bg-white shadow-md border-b border-blue-300"
>
  <button
    on:click={toggleDrawer}
    aria-label="Toggle Menu"
    class="text-3xl font-bold text-blue-600"
  >
    &#9776;
  </button>
  {#if title}
    <h1 class="ml-4 text-xl font-semibold text-blue-700 mt-1.5">{title}</h1>
  {/if}
</header>

{#if drawerOpen}
  <button
    type="button"
    class="drawer-backdrop"
    aria-label="Close menu"
    on:click={toggleDrawer}
    on:keydown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        toggleDrawer();
      }
    }}
    tabindex="0"
  ></button>
  <nav class="drawer bg-white rounded-r-lg shadow-lg border border-blue-200">
    <div>
      <button
        type="button"
        class="menu-item text-left w-full"
        on:click={() => navigateTo("/home")}
      >
        Home
      </button>

      <button
        type="button"
        class="menu-item text-left w-full"
        on:click={() => navigateTo("/settings")}
      >
        Settings
      </button>
    </div>
    {#if isLoggedIn}
      <button
        class="bg-red-500 text-white py-2 rounded mt-4 w-full hover:bg-red-600 transition"
        on:click={handleLogout}
      >
        Logout
      </button>
    {:else}
      <button
        class="bg-green-500 text-white py-2 rounded mt-4 w-full hover:bg-green-600 transition"
        on:click={() => navigateTo("/login")}
      >
        Login
      </button>
    {/if}
  </nav>
{/if}

<style>
  .drawer-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(147, 197, 253, 0.4); /* blue-300 transparan */
    z-index: 10;
  }

  .drawer {
    position: fixed;
    top: 0;
    left: 0;
    width: 260px;
    height: 100vh;
    z-index: 20;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .menu-item {
    padding: 0.75rem 0;
    cursor: pointer;
    border-bottom: 1px solid #bfdbfe; /* blue-200 */
    background: none;
    border: none;
    outline: none;
    font: inherit;
    text-align: left;
    color: #2563eb; /* blue-600 */
    font-weight: 600;
  }

  .menu-item:hover,
  .menu-item:focus {
    background-color: #dbeafe; /* blue-100 */
    color: #1e40af; /* blue-900 */
  }
</style>
