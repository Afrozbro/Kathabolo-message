"use client";

import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen  text-gray-200 px-6 py-10 md:px-20">
      <title>Kathabolo App - Terms & Conditions</title>
      <meta
        name="description"
        content="Kathabolo is a smart chatting and talking app that helps you connect instantly. Fast, secure, simple. Try Kathabolo today!"
      />
      <meta
        name="keywords"
        content="kathabolo, chat app, talking app, messaging app, kathabolo beta, kathabolo netlify"
      />
      <meta name="author" content="Kathabolo Team" />
      <div className="max-w-4xl mx-auto bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-800">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center">
          Terms & Conditions
        </h1>

        <p className="text-sm text-gray-400 text-center mb-8">
          Last Updated: November 7, 2025
        </p>

        <section className="space-y-6 leading-relaxed text-gray-300">
          <p>
            Welcome to <span className="font-semibold text-white">KathaBolo</span>, 
            a private and encrypted messaging platform. By using our app, you agree
            to the following Terms & Conditions. Please read them carefully before
            accessing or using our services.
          </p>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using KathaBolo, you agree to be bound by
              these Terms & Conditions and our Privacy Policy. If you do not agree
              with any part of these terms, please discontinue using the app immediately.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              2. Message Privacy and Encryption
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>All messages sent through KathaBolo are <strong>end-to-end encrypted</strong>.</li>
              <li>We cannot read, access, or share your private conversations.</li>
              <li>
                Message content remains visible only to the sender and intended
                recipient(s).
              </li>
              <li>
                Our encryption system ensures even developers or administrators cannot
                decrypt your messages.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              3. Data Usage and Storage
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                We may store limited metadata (timestamps or contact IDs) for technical
                functionality.
              </li>
              <li>We do not sell, trade, or share user data with third parties.</li>
              <li>You are responsible for maintaining your account credentials.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              4. Security Disclaimer
            </h2>
            <p>
              While we take extensive measures to protect your data, no system is
              completely immune to attacks. If our servers are compromised,
              <strong> KathaBolo will not be held responsible </strong>
              for any data loss, leakage, or unauthorized access to your messages.
              By using this app, you acknowledge and accept this risk.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              5. Unauthorized Access and Misuse
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                Attempting to bypass encryption, hack the app, or gain unauthorized
                access to other users’ data is strictly prohibited.
              </li>
              <li>
                Any user found engaging in such activity will have their account
                terminated and may face legal consequences.
              </li>
              <li>
                If someone bypasses our security system, they forfeit any right to claim
                damages or compensation.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              6. Limitation of Liability
            </h2>
            <p>
              KathaBolo and its developers shall not be liable for:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>
                Any loss or damage resulting from unauthorized access, server failure,
                or data breach.
              </li>
              <li>
                Any direct, indirect, or incidental damages arising from the use or
                inability to use the app.
              </li>
            </ul>
            <p className="mt-2">
              Use of this service is <strong>at your own risk.</strong>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              7. Changes to Terms
            </h2>
            <p>
              KathaBolo reserves the right to modify these Terms & Conditions at any
              time. Updated versions will be posted within the app, and continued use
              after updates implies acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">8. Contact Information</h2>
            <p>
              For any questions or concerns, please contact us at: <br />
              <a
                href="mailto:support@kathabolo.com"
                className="text-blue-400 hover:underline"
              >
                support@kathabolo.com
              </a>
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
