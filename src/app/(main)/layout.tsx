import { DeviceProvider } from "@/context/DeviceContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DeviceProvider>{children}</DeviceProvider>;
}
