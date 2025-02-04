"use client";

import React, { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/storage";
import { toast } from "react-toastify";

export function withAuth<P extends object>(WrappedComponent: ComponentType<P>): React.FC<P> {
  const WithAuth: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const user = getUser();

      if (!user || !user.data) {
        toast.error("You are not authorized to view this page without logging in.");
        router.push("/");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
}
