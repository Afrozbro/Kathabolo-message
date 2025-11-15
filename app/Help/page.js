"use client";

import React from "react";

export default function HelpPage() {
  return (
    <div className="min-h-screen  text-gray-200 px-6 py-10 md:px-20">
    <title>Kathabolo App - Help & Features</title>
      <meta
        name="description"
        content="How to use Kathabolo - A smart chatting and talking app that helps you connect instantly. Fast, secure, simple. Try Kathabolo today!"
      />
      <meta
        name="keywords"
        content="kathabolo, chat app, talking app, messaging app, kathabolo beta, kathabolo netlify"
      />
      <meta name="author" content="Kathabolo Team" />
      <div className="max-w-4xl mx-auto bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-800">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
          Help & Features
        </h1>

        <p className="text-sm text-gray-400 text-center mb-8">
          Learn how to use all the features of <span className="text-white font-semibold">KathaBolo</span>
        </p>

        <section className="space-y-8 leading-relaxed text-gray-300">
          {/* Change Profile Icon */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">🧑‍💻 Change Your Profile Icon</h2>
            <p>
              You can easily update your profile picture directly from the message page.
              Follow these steps:
            </p>
            <ul className="list-decimal ml-5 mt-2 space-y-1">
              <li>Go to your <span className="font-semibold">Message Page</span>.</li>
              <li>Click on your <span className="font-semibold">Profile Icon</span>.</li>
              <li>Enter or paste the image link in the <span className="font-semibold">Add Link</span> field.</li>
              <li>Click <span className="font-semibold text-green-400">Save</span> to update your profile icon.</li>
            </ul>
            <p className="mt-2 text-gray-400">
              ✅ Your new profile picture will appear instantly across the app.
            </p>
          </div>

          {/* Reply to Message */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">💬 Reply to a Message</h2>
            <p>
              To reply to any message from your chat partner:
            </p>
            <ul className="list-decimal ml-5 mt-2 space-y-1">
              <li>Go to the <span className="font-semibold">Write Message</span> page.</li>
              <li>Find the message you want to reply to.</li>
              <li>Click the <span className="font-semibold text-blue-400">Arrow Icon</span> on the right side of that message.</li>
              <li>Your selected message will appear above the typing area — type your reply and send it!</li>
            </ul>
            <p className="mt-2 text-gray-400">
              💡 This helps keep conversations organized and easy to follow.
            </p>
          </div>

          {/* Delete Message */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">🗑️ Delete a Message</h2>
            <p>
              You can delete any message you’ve sent:
            </p>
            <ul className="list-decimal ml-5 mt-2 space-y-1">
              <li>Locate the message you want to remove.</li>
              <li>Click the <span className="font-semibold text-red-400">Delete Icon</span> beside it.</li>
              <li>The message will be permanently removed from your chat.</li>
            </ul>
            <p className="mt-2 text-gray-400">
              ⚠️ Once deleted, a message cannot be recovered.
            </p>
          </div>

          {/* View Profile Icon */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">👀 View Profile Icon</h2>
            <p>
              Want to see your or your chat partner’s profile picture in full?
            </p>
            <ul className="list-decimal ml-5 mt-2 space-y-1">
              <li>Just click on the <span className="font-semibold">Profile Icon</span> in any chat.</li>
              <li>The profile image will open clearly for you to view.</li>
            </ul>
            <p className="mt-2 text-gray-400">
              🖼️ Simple, fast, and private — see who you’re chatting with anytime.
            </p>
          </div>
        </section>

        <div className="text-center text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} KathaBolo. All rights reserved.
        </div>
      </div>
    </div>
  );
}
