


"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");

  // ✅ Prefill email when authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session, status]);

  // ✅ Redirect to login if not signed in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // ✅ Check if user exists in DB and redirect accordingly
  useEffect(() => {
    const checkUser = async () => {
      if (!email) return;

      try {
        const res = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        if (!res.ok) {
          console.error("Server error:", data.message);
          return;
        }

        if (data.message === "User not found" || !data.exists) {
          // ❌ User not in DB → Go to createaccount page
          router.replace("/createaccount");
        } else {
          // ✅ User exists → Go to yourmessage page
          router.replace("/yourmessage");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    checkUser();
  }, [email, router]);

  // ✅ Loading UI while waiting
  if (status === "loading" || !email) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-200">
        Checking your account...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-lg text-gray-300">
      Redirecting based on your account...
    </div>
  );
}

