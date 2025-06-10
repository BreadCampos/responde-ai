import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const DefaultLayout = ({ children }: Props) => {
  return <>{children}</>;
};

export default DefaultLayout;
