import { writable } from "svelte/store";
import Cookies from "js-cookie";

export const isAuthenticated = writable(!!Cookies.get("token"));

export function login(token) {
  Cookies.set("token", token, { expires: 1 }); // expire 1 hari
  isAuthenticated.set(true);
}

export function logout() {
  Cookies.remove("token");
  isAuthenticated.set(false);
}
