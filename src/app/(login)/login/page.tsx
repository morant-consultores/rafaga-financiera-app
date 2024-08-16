import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center mb-20 w-screen">
      <div className="flex items-center mb-8">
        <div className="flex w-[75px] h-[75px]">
          <Image
            src="/rafaga.svg"
            alt="Ráfaga Financiera Logo"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }} // optional
          />
        </div>
        <h1 className="text-xl font-bold text-primary ml-3">
          RÁFAGA FINANCIERA
        </h1>
      </div>
      <Card className="lg:max-w-sm w-screen sm:min-w-[700px]">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>
            Inicia sesión en Ráfaga Financiera App
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/">
            <small>¿Olvidaste tu contraseña?</small>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
