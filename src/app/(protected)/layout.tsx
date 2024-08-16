import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import Menu from "./layoutClient";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  return (
    <div className="md:grid md:grid-cols-[300px_1fr] h-screen">
      <Menu />
      <div className="overflow-auto md:pt-8 pb-4 px-8 pt-4">{children}</div>
    </div>
  );
}
