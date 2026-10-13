import { RouteLoader } from "@/shared/components/motion/route-loader";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RouteLoader />
      {children}
    </>
  );
}
