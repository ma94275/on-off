import { DeviceProvider } from "@/context/DeviceContext";
import Toast from "@/components/layout/Toast";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DeviceProvider>
      {children}
      <Toast />
    </DeviceProvider>
  );
}
