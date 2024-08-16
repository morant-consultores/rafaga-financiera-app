import { FC } from "react";

interface Props {
  children: React.ReactNode;
}

const LoginLayout: FC<Props> = ({ children }: Props): JSX.Element => {
  return <div className="flex flex-col min-h-screen items-center justify-center p-24">{children}</div>;
};

export default LoginLayout;
