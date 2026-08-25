import QRCode from "qrcode";

export async function genererQrCodeDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, { margin: 1, width: 200, color: { dark: "#3b2a1c", light: "#f7f1e3" } });
}
