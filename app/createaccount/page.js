"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import { Puff } from "react-loader-spinner";
import toast from "react-hot-toast";
// make sure you installed this package

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const usernameRef = useRef();

  const [check, setCheck] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileicon: "",
    username: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => setIsChecked(e.target.checked);

  //if user login then go the message page

  useEffect(() => {
    const checkUser = async () => {
      if (!session?.user?.email) return; // make sure session is loaded
      const email = session.user.email;

      try {
        const res = await fetch(
          `/api/users?email=${encodeURIComponent(email)}`
        );
        const data = await res.json();

        if (!res.ok) {
          console.error("Server error:", data.message);
          return;
        }

        if (data.message === "User not found" || !data.exists) {
          // ❌ User not in DB → stay on createaccount
          console.log("User not found, stay on this page");
          return;
        } else {
          // ✅ User exists → redirect
          router.replace("/yourmessage");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    if (status === "authenticated") {
      checkUser();
    }
  }, [session, status, router]);

  // ✅ Prefill email when session is loaded
  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({ ...prev, email: session.user.email }));
    }
  }, [session]);

  // ✅ Redirect if not signed in (or adjust logic as needed)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Puff
          height="100"
          width="100"
          color="#59fb59"
          ariaLabel="puff-loading"
        />
      </div>
    );
  }

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit form logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input first

    if (!formData.name || !formData.username) {
      toast.error("Please fill in all fields.");

      return;
    }
    const finalData = {
      ...formData,
      username: formData.username.toLowerCase(),
      profileicon:
        formData.profileicon ||
        "https://i.ibb.co/xSpRyYmR/gemini-2-5-flash-image-preview-nano-banana-a-A-default-profile-ic.png",
    };

    // Validate username check
    if (check === null) {
      toast.error("Please check your username first.");
      return;
    }

    if (!check) {
      toast.error("Username is not available. Please choose another.");
      return;
    }
    if (isChecked) {
      // ✅ If all good
      // console.log("Form submitted:", formData);

      // Example: send data to backend

      const res = await fetch("/api/saveuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Show clear error to the user (duplicate or server error)
        // alert(result.message || "Failed to create account. Try again.");
        toast.error("Failed to create account. Try again.");
        // console.error("Save user failed:", result);
        return;
      }

      // Success — redirect to yourmessage so the saved profile is fetched and displayed
      router.replace("/yourmessage");

      // Reset form (kept for cleanliness, though we redirect)
      setFormData({
        name: "",
        email: session?.user?.email || "",
        username: "",
        profileicon: "",
      });

      setCheck(null);
    } else {
      toast.error("accept the terms and conditions");
    }
  };

  const usercheck = async () => {
    const username = usernameRef.current.value.trim();
    const mainusername = username.toLowerCase();
    if (!username) {
      toast.error("Enter username");
      return;
    }

    try {
      const res = await fetch(
        `/api/username?username=${encodeURIComponent(mainusername)}`
      );
      const data = await res.json();

      if (!res.ok) {
        console.error("Error:", data.message);

        toast.error("Server error, try again later");
        return;
      }

      if (data.exists) {
        // ❌ username already taken
        setCheck(false);

        toast.error("Username already taken");
      } else {
        // ✅ username available
        setCheck(true);

        toast.success("Username available");
      }
    } catch (err) {
      // console.error("Error fetching user:", err);
    }
  };
  const terms = () => {
    router.push("/terms&conditions");
  };

  // ✅ Only show the form when session exists
  if (session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6 rounded-3xl shadow-xl text-white w-full max-w-md">
          <h1 className="text-center font-bold text-3xl mb-6">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1" htmlFor="name">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-1" htmlFor="email">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly // prevent user from editing email
                className="w-full p-2 rounded bg-gray-800 text-gray-400 border border-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block mb-1" htmlFor="profileicon">
                Profile Icon Direct Link:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Blank / Direct link"
                  id="profileicon"
                  name="profileicon"
                  value={formData.profileicon}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                />
                <div className="flex items-center justify-center">
                  <a href="https://imgbb.com/">
                    <button
                      type="button"
                      className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      Create Link
                    </button>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-1" htmlFor="username">
                Username:
              </label>
              <div className="flex gap-3.5 items-center justify-around">
                <div className="tik ]">
                  {check === null ? (
                    <img src="neutral.svg" alt="" />
                  ) : check ? (
                    <img className="h-[50px]" src="check.svg" alt="Available" />
                  ) : (
                    <img className="h-[50px]" src="close.svg" alt="Taken" />
                  )}
                </div>
                <input
                  id="username"
                  name="username"
                  placeholder="check your username"
                  ref={usernameRef}
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                />
                <button
                  type="button"
                  onClick={usercheck}
                  className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  check
                </button>
              </div>
            </div>
            <div className="flex gap-1.5">
              <input
                checked={isChecked}
                onChange={handleCheckboxChange}
                className=" h-[25px] w-[25px]"
                type="checkbox"
                name="trams & condiction"
                id=""
              />
              <h1 className="text-indigo-200">
                I read all{" "}
                <span onClick={terms} className="text-blue-300 cursor-pointer">
                  terms & conditions{" "}
                </span>{" "}
                and i accept it.
              </h1>
            </div>

            <button
              type={"submit"}
              className="relative cursor-pointer inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="cursor-pointer relative px-5 py-2.5 transition-all ease-in duration-75 font-bold text-2xl bg-gradient-to-br from-purple-600 to-blue-500 bg-white  rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Create
              </span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
