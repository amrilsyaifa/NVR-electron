<script>
  import { login } from "../stores/auth";
  import { apiFetch } from "../lib/api";

  let username = "";
  let password = "";

  async function handleLogin() {
    try {
      const res = await apiFetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token);
        window.location.hash = "#/home";
      } else {
        alert(data.message || "Login gagal!");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi!");
    }
  }
</script>

<div
  class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-100 px-4"
>
  <form
    on:submit|preventDefault={handleLogin}
    class="bg-white rounded-xl shadow-xl p-10 max-w-md w-full"
  >
    <h1 class="text-3xl font-bold mb-8 text-center text-gray-800">Login</h1>

    <label class="block mb-2 text-gray-700 font-semibold" for="username"
      >Username</label
    >
    <input
      id="username"
      type="text"
      bind:value={username}
      placeholder="Username"
      required
      class="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <label class="block mb-2 text-gray-700 font-semibold" for="password"
      >Password</label
    >
    <input
      id="password"
      type="password"
      bind:value={password}
      placeholder="Password"
      required
      class="w-full border border-gray-300 rounded-md px-4 py-2 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <button
      type="submit"
      class="w-full bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 transition"
    >
      Login
    </button>
  </form>
</div>
