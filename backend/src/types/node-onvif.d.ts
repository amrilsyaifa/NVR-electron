declare module "node-onvif" {
  export interface OnvifDeviceInfo {
    Types: string;
    HardwareId?: string;
    // tambahkan properti lain kalau perlu
  }

  export interface OnvifDevice {
    hostname: string;
    name?: string;
    address: string;
    info: OnvifDeviceInfo;
  }

  export function startProbe(options?: { timeout?: number }): Promise<void>;
  export function getActiveDevices(): OnvifDevice[];
}
