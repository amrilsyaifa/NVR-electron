import HomeWithGuard from "../guards/HomeGuard.svelte";
import LoginWithGuard from "../guards/LoginGuard.svelte";
import SettingGuard from "../guards/SettingGuard.svelte";
import SettingCameraGuard from "../guards/SettingCameraGuard.svelte";
import NotFound from "../pages/NotFound.svelte";
import Redirect from "../pages/Redirect.svelte";

export default {
  "/": Redirect,
  "/home": HomeWithGuard,
  "/login": LoginWithGuard,
  "/settings": SettingGuard,
  "/settings/camera": SettingCameraGuard,
  "*": NotFound,
};
