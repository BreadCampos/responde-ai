import type { ReactNode } from "react";
import { Sidebar } from "./layout/sidebar";
import { Header } from "./layout/header";

interface Props {
  children: ReactNode;
}

const DefaultLayout = ({ children }: Props) => {
  return (
    <div className="flex h-screen  bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 ">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout;
