"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-white px-6 py-12">
      <title>Kathabolo App - About</title>
      <meta
        name="description"
        content="here is about kathabolo app page"
      />
      <meta
        name="keywords"
        content="kathabolo, chat app, talking app, messaging app, kathabolo beta, kathabolo netlify"
      />
      <meta name="author" content="Kathabolo Team" />
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-extrabold mb-6 text-center"
      >
        About <span className="text-blue-400">KathaBolo</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl text-center leading-relaxed text-lg md:text-xl text-gray-300 space-y-6"
      >
        <p>
          Hello 👋, I’m <span className="font-semibold text-white">SK Afroz</span>, a passionate web developer
          who has been learning and building amazing things on the web for the past{" "}
          <span className="font-semibold text-white">6 months</span>. During this journey, I’ve explored
          technologies like <span className="text-blue-400">Next.js, React, MongoDB, Tailwind CSS,</span> and
          more — and turned my learning into something real.
        </p>

        <p>
          <span className="text-blue-400 font-semibold">KathaBolo</span> is my first{" "}
          <span className="font-semibold text-white">production-level message web app</span>. It’s built to
          give users a fast, private, and smooth chatting experience. Every message you send is{" "}
          <span className="font-semibold text-white">encrypted</span> for your safety, and you can easily
          change your profile icon, reply to messages, or delete your own chats anytime.
        </p>

        <p>
          The name <span className="text-blue-400 font-semibold">“KathaBolo”</span> comes from the word{" "}
          <span className="italic">‘Katha’</span> meaning “Talk” — because this app is all about connecting and
          communicating safely and freely.
        </p>

        <p>
          My goal with KathaBolo is to show what can be achieved with passion and persistence. I built this app
          from scratch — from backend logic to UI — to prove that even with a few months of experience, you can
          create something powerful and meaningful when you believe in your idea.
        </p>

        <p>
          I’m constantly improving KathaBolo by adding new features, polishing the interface, and making it more
          secure. Thank you for being a part of this journey 💙 — your support motivates me to keep building and
          learning every single day.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10"
      >
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 cursor-pointer py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-semibold text-lg"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
