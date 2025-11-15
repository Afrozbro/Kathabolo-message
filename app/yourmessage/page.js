"use client";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Puff } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

const page = () => {
  const { data: session, status } = useSession();
  const finduserref = useRef();
  const router = useRouter();
  const [userfind, setuserfind] = useState(null);
  const [userdetail, setUserdetail] = useState({
    username: "",
    name: "",
    email: "",
    profileicon: "",
  });
  const [formData, setFormData] = useState({
    username: "",
  });
  const [mycontact, setmycontact] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const finduser = async () => {
    const username = finduserref.current.value.toLowerCase();
    // console.log(username);
    if (!username) {
      toast.error("Enter username");
      return;
    }

    try {
      const res = await fetch(
        `/api/username?username=${encodeURIComponent(username)}`
      );
      const data = await res.json();

      if (!res.ok) {
        // console.error("Error:", data.message);

        toast.error("Server error, try again later");
        return;
      }

      if (data.exists) {
        // ❌ username already taken
        setuserfind(true);
        // alert("Username available");
      } else {
        // ✅ username not  available
        setuserfind(false);
        // alert("Username not  available");
      }
    } catch (err) {
      // console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    if (!session) {
      router.push("/signin");
    }
  }, []);

  const fetchUsername = async (email) => {
    try {
      const res = await fetch(
        `/api/userbyemail?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();

      if (!res.ok) {
        router.push("/createaccount");
        return null;
      }
      setUserdetail((prev) => ({
        ...prev,
        username: data.username,
        name: data.name,
        email: data.email,
        profileicon: data.profileicon || "",
      }));

      return data.username;
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const gomessage = (e) => {
    const reciver = userdetail.username;
    router.push(`/writemessage?sender=${reciver}&reciver=${e}`);
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchUsername(session.user.email);
    }
  }, [session]);

  const writemessage = () => {
    const reciver = finduserref.current.value.toLowerCase();
    const sender = userdetail.username;

    router.push(`/writemessage?sender=${sender}&reciver=${reciver}`);
  };

  useEffect(() => {
    const reciver = userdetail.username;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/contactmessage?reciver=${reciver}`);
        const data = await res.json();

        if (data.success) {
          setmycontact(data.messages); // ✅ Correct way to update state
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    // 🟢 Fetch immediately once
    fetchMessages();

    // 🟢 Then repeat every 5 seconds
    const interval = setInterval(fetchMessages, 5000);

    // 🧹 Cleanup on unmount
    return () => clearInterval(interval);
  }, [userdetail.username]);

  // const uniqueSenders = [
  //   ...new Map(mycontact.reverse().map((item) => [item.sender, item])).values(),
  // ];
  // 🔹 Group by sender & count unseen messages

  const uniqueUsers = Object.values(
    mycontact
      .slice()
      .reverse()
      .reduce((acc, msg) => {
        const otherUser =
          msg.sender === userdetail.username ? msg.reciver : msg.sender;

        if (!acc[otherUser]) {
          acc[otherUser] = {
            username: otherUser,
            profileicon:
              msg.sender === userdetail.username
                ? msg.reciverIcon
                : msg.senderIcon,
            unseenCount: 0,
          };
        }

        if (msg.reciver === userdetail.username && !msg.seen) {
          acc[otherUser].unseenCount += 1;
        }

        return acc;
      }, {})
  );

  //show dp
  const [dp, setDp] = useState(null); // store dp URL
  const [showPopup, setShowPopup] = useState(false);
  const showdp = (e) => {
    setDp(e);
    setShowPopup(true);
  };

  const closepop = () => {
    setShowPopup(false);
  };
  const [mydp, setmyDp] = useState(null);
  const [showdpPopup, setShowdpPopup] = useState(false);
  const showmydp = (e) => {
    setmyDp(e);
    setShowdpPopup(true);
  };
  const closedppop = () => {
    setShowdpPopup(false);
  };

  //edit user detail and update
  const [editformData, seteditFormData] = useState({
    profileicon: "",
  });

  // Handle input changes
  const edithandleChange = (e) => {
    const { name, value } = e.target;
    seteditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const edithandleSubmit = async (e) => {
    e.preventDefault();
    if (!editformData.profileicon) {
      toast.error("Enter profileicon link");
    } else {
      try {
        const res = await fetch("/api/updateuser", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: userdetail.username,
            profileicon: editformData.profileicon,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success(
            `✅ Profile icon updated successfully for ${data.user.username}`
          );

          seteditFormData({ profileicon: "" }); // Reset form
        } else {
          toast.error(`❌ Failed to update: ${data.message}`);
        }
      } catch (err) {
        toast.error("Server error while updating profile icon.");
      }
    }
  };
  //account delete
  const deleteaccount = async (username) => {
    try {
      const res = await fetch(`/api/deleteaccount?username=${username}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Your account has been deleted successfully!");
        router.push("/");
        // Optionally: logout or redirect to home
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Something went wrong!");
    }
  };
const [deletepopup, setdeletepopup] = useState(false)
  const deletepop = (e) => {
setdeletepopup(true)

  };

  const closedeletepop=()=>{
    setdeletepopup(false)
  }



  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Puff
          height="100"
          width="100"
          color="#59fb59"
          ariaLabel="puff-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className=" w-full min-h-screen ">
     <title>Kathabolo App - See your All Chats</title>
      <meta
        name="description"
        content="Kathabolo is a smart chatting and talking app that helps you connect instantly. Fast, secure, simple. Try Kathabolo today!"
      />
      <meta
        name="keywords"
        content="kathabolo, chat app, talking app, messaging app, kathabolo beta, kathabolo netlify"
      />
      <meta name="author" content="Kathabolo Team" />
      <div
        className={`absolute z-100 h-[45%] lg:h-[50%] w-[90%] lg:w-[25%] md:w-[50%] md:h-[50%]
  left-[5%] lg:left-[35%] top-[30%] md:left-[25%]
  bg-black/70 rounded-2xl shadow-2xl flex items-center justify-center
  transform transition-all duration-300 ease-out
  ${
    showPopup
      ? "scale-100 opacity-100"
      : "scale-90 opacity-0 pointer-events-none"
  }`}
      >
        <img
          className="h-full w-full rounded-2xl object-cover"
          alt=""
          srcSet={dp}
        />

        <div className="absolute top-2 right-2">
          <img
            onClick={closepop}
            className="h-[40px] cursor-pointer hover:scale-110 transition-transform"
            alt=""
            src="close white.svg"
          />
        </div>
      </div>
      <div
        className={`absolute z-110 h-[45%] lg:h-[50%] w-[90%] lg:w-[25%] md:w-[50%] md:h-[50%]
  left-[5%] lg:left-[35%] top-[30%] md:left-[25%]
  bg-black/70 rounded-2xl shadow-2xl flex items-center justify-center
  transform transition-all duration-300 ease-out
  ${
    deletepopup
      ? "scale-100 opacity-100"
      : "scale-90 opacity-0 pointer-events-none"
  }`}
      >
        <button onClick={()=>{deleteaccount(userdetail.username)}} className="cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
            Delete
          </span>
        </button>
          <button onClick={closedeletepop}  className="cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
           Cancle
          </span>
        </button>

        <div className="absolute top-2 right-2">
          <img
            onClick={closedeletepop}
            className="h-[40px] cursor-pointer hover:scale-110 transition-transform"
            alt=""
            src="close white.svg"
          />
        </div>
      </div>
      <div
        className={`absolute z-100 h-[80%] lg:h-[80%] w-[90%] lg:w-[25%] md:w-[80%]
  left-[5%] lg:left-[35%] top-[10%] md:left-[10%]
 bg-gradient-to-r from-slate-900 to-indigo-800 rounded-2xl shadow-2xl flex items-center justify-center
  transform transition-all duration-300 ease-out
  ${
    showdpPopup
      ? "scale-100 opacity-100"
      : "scale-90 opacity-0 pointer-events-none"
  } ${deletepopup? "blur-2xl":"blur-none"}` }
      >
        <div className="flex flex-col items-center h-full justify-center">
          <h1 className="text-3xl font-bold">Edit your profile details</h1>

          <div className="editform h-[50%] w-full">
            <form
              className="flex flex-col gap-3 items-center h-[100%] w-full"
              onSubmit={edithandleSubmit}
            >
              <label>Profileicon:</label>
              <textarea
                className="border-2 rounded-2xl p-1.5 h-[12%] w-[100%]"
                name="profileicon"
                placeholder="provide direct link"
                value={editformData.profileicon}
                onChange={edithandleChange}
              />
              <div className="flex gap-5 items-center justify-center">
                <a href="https://imgbb.com/">
                  <button
                    type="button"
                    className="w-full cursor-pointer sm:w-auto px-6 py-2.5 rounded-lg text-white font-semibold text-base bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all duration-200"
                  >
                    create link
                  </button>
                </a>
                <button
                  type="submit"
                  className="text-white cursor-pointer bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
          <div className="delete">
            <button
              onClick={() => {
                deletepop(userdetail.username);
              }}
              className="relative cursor-pointer inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Delete Account
              </span>
            </button>
          </div>
          <img
            className="h-[20%] w-[50%] rounded-2xl object-cover"
            alt=""
            srcSet={mydp}
          />
        </div>
        <div className="absolute top-2 right-2">
          <img
            onClick={closedppop}
            className="h-[40px] cursor-pointer hover:scale-110 transition-transform"
            alt=""
            src="close white.svg"
          />
        </div>
      </div>

      <div
        className={`${
          showPopup
            ? "blur-sm pointer-events-none"
            : "blur-none pointer-events-auto"
        } ${
          showdpPopup
            ? "blur-sm pointer-events-none"
            : "blur-none pointer-events-auto"
        }`}
      >
        {/* Top Section */}
        <div className=" sticky z-10 top-0 bg-black md:bg-transparent flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
          {/* User Info */}
          <div className="text-center flex-col flex gap-1.5 md:text-left">
            <div className="flex items-center gap-3">
              <img
                onClick={() => {
                  showmydp(userdetail.profileicon);
                }}
                srcSet={userdetail.profileicon}
                alt="avatar"
                className="w-12 h-12 rounded-full hover:border-1 cursor-pointer object-cover"
              />

              <h1 className="text-xl md:text-2xl font-semibold text-gray-100">
                👋 Hello{" "}
                <span className="text-blue-400">{userdetail.name}</span>
              </h1>
            </div>
            <p className="text-sm md:text-base text-gray-400 mt-1">
              Your username:{" "}
              <span className="font-medium text-white">
                {userdetail.username}
              </span>
            </p>
          </div>

          {/* Search / Form Section */}
          <div className="flex gap-2.5">
            {userfind === null ? null : userfind ? (
              <img
                className="w-[40px] h-[40px] "
                alt="userfind"
                srcSet="userfing.gif"
              />
            ) : (
              <img
                className="w-[40px] h-[40px]"
                alt="usernotfind"
                srcSet="usernotfound.gif"
              />
            )}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            >
              <input
                type="text"
                id="username"
                name="username"
                ref={finduserref}
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
                className="w-full sm:w-64 p-2.5 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              <button
                type="button"
                onClick={finduser}
                className="w-full cursor-pointer sm:w-auto px-6 py-2.5 rounded-lg text-white font-semibold text-base bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all duration-200"
              >
                Find
              </button>
            </form>

            {userfind === null ? null : userfind ? (
              <button
                type="button"
                onClick={writemessage}
                className="w-full cursor-pointer sm:w-auto px-6 py-2.5 rounded-lg text-white font-semibold text-base bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-all duration-200 text-center"
              >
                Message
              </button>
            ) : null}
          </div>
        </div>

        <div className="contactmessage flex flex-col w-[100%] items-center justify-center gap-3.5">
          {uniqueUsers.length > 0 ? (
            uniqueUsers.map((item) => (
              <li
                onClick={() => gomessage(item.username)}
                className="w-[100%] md:w-[60%] hover:bg-slate-700 flex items-center justify-between gap-3.5 cursor-pointer h-[15%] rounded-2xl list-none p-2.5 text-3xl font-bold bg-slate-800"
                key={item.username}
              >
                <div className="flex items-center gap-2">
                  <img
                    onClick={(e) => {
                      e.stopPropagation(); // 🚫 prevents parent click
                      showdp(item.profileicon); // 👈 your function for showing DP
                    }}
                    className="w-[50px] z-1 rounded-full hover:border-2 "
                    alt=""
                    srcSet={
                      !item.profileicon
                        ? "https://i.ibb.co/xSpRyYmR/gemini-2-5-flash-image-preview-nano-banana-a-A-default-profile-ic.png"
                        : item.profileicon
                    }
                  />
                  {item.username}
                </div>
                {item.unseenCount > 0 && (
                  <div className="h-[25px] w-[25px] bg-green-600 rounded-full text-[16px] flex items-center justify-center text-white font-semibold">
                    {item.unseenCount}
                  </div>
                )}
              </li>
            ))
          ) : (
            <p>No message found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
