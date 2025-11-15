


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
      router.replace("/signin");
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
        <title>Kathabolo App - Checking Your Account</title>
      <meta
        name="description"
        content="Kathabolo is a smart chatting and talking app that helps you connect instantly. Fast, secure, simple.checking your account..."
      />
      <meta
        name="keywords"
        content="kathabolo, chat app, talking app, messaging app, kathabolo beta, kathabolo netlify"
      />
      <meta name="author" content="Kathabolo Team" />
        Checking your account...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-lg text-gray-300">
     <title>Kathabolo App - Chat, Talk & Connect Easily</title>
      <meta
        name="description"
        content="Kathabolo is a smart chatting and talking app that helps you connect instantly. Fast, secure, simple.account finding. Try Kathabolo today!"
      />
      <meta
        name="keywords"
        content="kathabolo, chat app, talking app, messaging app, kathabolo beta, kathabolo netlify"
      />
      <meta name="author" content="Kathabolo Team" />
      Redirecting based on your account...
    </div>
  );
}

