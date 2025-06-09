<script>
  import { onMount } from "svelte";
  import Header from "../components/Header.svelte";
  import { apiFetch } from "../lib/api";
  import { Pencil, Trash } from "@lucide/svelte";

  let cameras = [];
  let showModal = false;
  let editMode = false;
  let editId = null;

  let discoveredDevices = [];
  let newName = "";
  let newIP = "";
  let newPort = null;
  let newUsername = "";
  let newPassword = "";

  let showDeleteModal = false;
  let deleteId = null;

  function confirmDelete(id) {
    deleteId = id;
    showDeleteModal = true;
  }

  function closeDeleteModal() {
    showDeleteModal = false;
    deleteId = null;
  }

  async function fetchDiscoveredDevices() {
    try {
      const res = await apiFetch("/api/discover/cctv");

      if (res.ok) {
        const data = await res.json();
        const existingIPs = cameras.map((cam) => cam.ip);

        discoveredDevices = (data.devices || []).filter(
          (device) => !existingIPs.includes(device.address)
        );
      } else {
        discoveredDevices = [];
      }
    } catch (err) {
      console.error(err);
      discoveredDevices = [];
    }
  }

  function handleSelectIP(e) {
    const selectedAddress = e.target.value;
    const selectedDevice = discoveredDevices.find(
      (d) => d.address === selectedAddress
    );
    if (selectedDevice) {
      newIP = selectedDevice.address;
      newPort = selectedDevice.port;
    } else {
      newIP = "";
      newPort = 8000;
    }
  }

  async function deleteCamera() {
    try {
      const res = await apiFetch(`/api/cctv/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchCameras();
        closeDeleteModal();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete camera.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting.");
    }
  }

  async function fetchCameras() {
    try {
      const res = await apiFetch("/api/cctvs");

      if (res.ok) {
        const data = await res.json();
        cameras = data || [];
      } else {
        cameras = [];
      }
    } catch (err) {
      cameras = [];
    }
  }

  function openModal() {
    showModal = true;
    editMode = false;
    editId = null;
    newName = "";
    newIP = "";
    newPort = null;
    newUsername = "";
    newPassword = "";
  }

  function closeModal() {
    showModal = false;
    discoveredDevices = [];
  }

  async function editCamera(id) {
    try {
      const res = await apiFetch(`/api/cctv/${id}`);

      if (res.ok) {
        const cam = await res.json();
        newName = cam.name;
        newIP = cam.ip;
        newPort = cam.port;
        newUsername = cam.username;
        newPassword = cam.password;

        editMode = true;
        editId = id;
        showModal = true;
      } else {
        alert("Failed to fetch camera data.");
      }
    } catch (err) {
      console.error(err);
      alert("Error while fetching camera.");
    }
  }

  async function saveCamera() {
    if (!newName || !newIP || !newPort || !newUsername || !newPassword) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const url = editMode ? `/api/cctv/${editId}` : `/api/cctv`;

      const method = editMode ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          ip: newIP,
          port: newPort,
          username: newUsername,
          password: newPassword,
        }),
      });

      if (res.ok) {
        await fetchCameras();
        closeModal();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to save camera.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    }
  }

  $: if (showModal) {
    fetchDiscoveredDevices();
  }

  onMount(() => {
    fetchCameras();
  });
</script>

<Header title="Camera Settings" />

<main class="p-6 bg-white min-h-screen">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold text-blue-800">Camera List</h1>
    <button
      on:click={openModal}
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      + Add Camera
    </button>
  </div>

  {#if cameras.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each cameras as cam}
        <div
          class="p-4 bg-blue-50 border border-blue-200 rounded shadow relative"
        >
          <h2 class="text-lg font-semibold text-blue-800">{cam.name}</h2>
          <p class="text-blue-600">IP: {cam.ip}</p>
          <p class="text-blue-600">Port: {cam.port}</p>

          <button
            on:click={() => editCamera(cam.id)}
            class="cursor-pointer absolute top-2 right-2 p-2 text-blue-600 hover:text-blue-800"
            aria-label="Edit Camera"
          >
            <Pencil class="w-5 h-5" />
          </button>
          <button
            on:click={() => confirmDelete(cam.id)}
            class="cursor-pointer absolute top-2 right-10 p-2 text-red-600 hover:text-red-800"
            aria-label="Delete Camera"
          >
            <Trash class="w-5 h-5" />
          </button>
        </div>
      {/each}
    </div>
  {:else}
    <div class="text-center text-gray-500 mt-12 text-lg">
      No cameras registered.
    </div>
  {/if}

  {#if showModal}
    <div
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 class="text-2xl font-bold mb-4 text-blue-800">
          {editMode ? "Edit Camera" : "Add Camera"}
        </h2>
        <div class="space-y-4">
          <input
            type="text"
            bind:value={newName}
            placeholder="Nama Camera"
            class="border p-2 w-full rounded"
          />
          <select
            on:change={handleSelectIP}
            class="border p-2 w-full rounded"
            bind:value={newIP}
          >
            <option value="">-- Pilih IP Address --</option>
            {#each discoveredDevices as device}
              <option value={device.address}>
                {device.address}
              </option>
            {/each}
          </select>
          <input
            type="number"
            bind:value={newPort}
            placeholder="Port"
            class="border p-2 w-full rounded"
            readonly
          />
          <input
            type="text"
            bind:value={newUsername}
            placeholder="Username"
            class="border p-2 w-full rounded"
          />
          <input
            type="password"
            bind:value={newPassword}
            placeholder="Password"
            class="border p-2 w-full rounded"
          />

          <div class="flex justify-end space-x-2">
            <button
              on:click={closeModal}
              class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >Cancel</button
            >
            <button
              on:click={saveCamera}
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if showDeleteModal}
    <div
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-red-700">Are you sure?</h2>
        <p class="text-gray-700 mb-6">
          Do you really want to delete this camera? This action cannot be
          undone.
        </p>

        <div class="flex justify-end space-x-2">
          <button
            on:click={closeDeleteModal}
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            on:click={deleteCamera}
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>
