"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Puff } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const reciver = searchParams.get("reciver");
  const sender = searchParams.get("sender");
  const [messagehistory, setmessagehistory] = useState([]);

  const message = useRef();
  const bottomRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/sendmessage?sender=${sender}&reciver=${reciver}`
        );
        const data = await res.json();

        if (data.success) {
          setmessagehistory(data.messages); // ✅ Correct way to update state
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
  }, [sender, reciver]);

  const send = async () => {
    const sharemessage = message.current.value.trim();

    if (!sharemessage) {
      toast.error("Please enter a message");
      return;
    }

    // ✅ Create message object properly
    const mymessage = { sender, reciver, sharemessage, seen: false };

    // ✅ Send to backend
    const res = await fetch("/api/sendmessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mymessage), // not {mymessage}
    });

    const data = await res.json();

    if (data.success) {
      // alert("Message saved successfully!");
      message.current.value = "";
    } else {
      toast.error("message is not send");
      console.error(data.error);
    }
  };
  useEffect(() => {
    if (!session) {
      router.push("/signin");
    }
  }, []);

  //delete message
  const deleteMessage = async (id) => {
    try {
      const res = await fetch("/api/delmess", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      console.log("🧩 Delete response:", data);

      if (res.ok) {
        // ✅ Update UI
        setdltpopup(false);
        setdetitem(null);
        toast.success("✅ message successfully deleted");
      } else {
        toast.error("✅ message is not delete");
      }
    } catch (err) {
      toast.error("✅ message is not delete");
    }
  };

  useEffect(() => {
    // Scroll to bottom whenever `messages` change
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messagehistory]);

  //for seen all messages
  useEffect(() => {
    const markUnseenAsSeen = async () => {
      // Replace 'userdetail.username' with your actual logged-in username variable
      const unseenMessages = messagehistory.filter(
        (msg) => msg.sender !== sender && !msg.seen
      );

      console.log("Unseen messages:", unseenMessages);

      if (unseenMessages.length > 0) {
        try {
          await fetch("/api/updateseen", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: unseenMessages, // send unseen message array
            }),
          });
          // console.log("✅ Marked unseen messages as seen");
        } catch (error) {
          console.error("❌ Error updating seen:", error);
        }
      }
    };

    markUnseenAsSeen();
  }, [messagehistory]);

  const [userdetail, setUserdetail] = useState({
    username: "",
    name: "",
    email: "",
    profileicon: "",
  });
  //find profile picture
  const fetchUserdetils = async (reciver) => {
    try {
      const res = await fetch(
        `/api/userbyusername?username=${encodeURIComponent(reciver)}`
      );
      console.log(`this is : ${reciver}`);
      const data = await res.json();

      if (!res.ok) {
        router.push("/createaccount");
        return null;
      }
      setUserdetail({
        username: data.user.username,
        name: data.user.name,
        email: data.user.email,
        profileicon: data.user.profileicon || "",
      });
      console.log(userdetail.name);
      return data.username;
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };
  useEffect(() => {
    fetchUserdetils(reciver);
  }, [messagehistory]);

  //reply section
  const Reply = (msg) => {
    if (msg.startsWith("Reply")) {
      let repvalue = `Reply: ${msg.split("-")[1]?.trim()} :-`;
      message.current.value = repvalue;
    } else {
      let repvalue = `Reply: ${msg} :- `;
      message.current.value = repvalue;
    }
  };

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
  const [detitem, setdetitem] = useState(null);
  const [dltpopup, setdltpopup] = useState(false);

  const showdltpopup = (id) => {
    setdetitem(id);
    setdltpopup(true);
  };
  const hidedltpopup = () => {
    setdltpopup(false);
    setdetitem(null);
  };

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
    <div className="relative h-[50vh]  text-white">
      <div
        className={`absolute z-100 h-[90%] lg:h-[100%] w-[90%] lg:w-[25%] 
  left-[5%] lg:left-[35%] top-[30%] md:h-[100%]
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
      <div>
        <div
          className={`deletemsg h-[10vh] w-[90vw] md:w-[20vw] bg-gradient-to-br from-slate-900 to-blue-700 absolute top-[50%] left-[40%] rounded-full  items-center flex-col justify-around ${
            dltpopup ? "flex" : "hidden"
          }  `}
        >
          <h1 className="text-2xl font-bold">Delete this message</h1>
          <div className="flex items-center justify-around">
            <button
              onClick={() => {
                deleteMessage(detitem);
              }}
              type="button"
              className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer"
            >
              Delete
            </button>
            <button
              onClick={hidedltpopup}
              type="button"
              className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer"
            >
              Cancle
            </button>
          </div>
        </div>
      </div>
      <div
        className={`${
          showPopup
            ? "blur-sm pointer-events-none"
            : "blur-none pointer-events-auto"
        }`}
      >
        {/* Header */}
        <div className="h-[7vh]  sticky top-0 z-50 relative p-2 rounded-2xl bg-slate-800 flex items-center justify-around">
          <div className="profile flex items-center md:justify-center gap-2.5 overflow-x-hidden">
            <img
              onClick={() => {
                showdp(userdetail.profileicon);
              }}
              className="h-[45px] cursor-pointer md:h-[50px] md:w-[50px] rounded-full"
              alt="profile-icon"
              srcSet={userdetail.profileicon}
            />
            <div className="username text-2xl font-bold">{reciver}</div>
          </div>
        </div>
        <div className="mess h-[75vh] w-full overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-blue  flex flex-col gap-2.5 my-2.5">
          {messagehistory.length > 0 ? (
            messagehistory.map((msg) => {
              const isMe = msg.sender === sender; // ✅ Check if I sent it
              return (
                <li
                  key={msg._id}
                  className={`list-none p-2  rounded-lg w-fit max-w-[70%] ${
                    isMe
                      ? "self-end bg-blue-600 text-white" // my message (right side)
                      : "self-start bg-slate-900 text-gray-200" // received message (left side)
                  }`}
                >
                  {msg.sharemessage}{" "}
                  {isMe && (
                    <button
                      onClick={() => showdltpopup(msg._id)}
                      className=" -right-2  group-hover:flex bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <Trash2 className="cursor-pointer" size={14} />
                    </button>
                  )}
                  {!isMe && (
                    <img
                      onClick={() => {
                        Reply(msg.sharemessage);
                      }}
                      className="h-[25px]  relative -top-[50%] left-[105%]"
                      alt=""
                      srcSet="reply.svg"
                    />
                  )}
                  <div className=" flex justify-end gap-5">
                    <p className="text-[10px] flex items-center justify-end">
                      {new Date(msg.timestamp).toLocaleTimeString("en-IN", {
                        hour12: true,
                        timeZone: "Asia/Kolkata",
                      })}
                    </p>
                    <p className="text-[10px] flex items-center justify-end">
                      {new Date(msg.timestamp).toLocaleDateString("en-IN")}
                    </p>

                    {isMe &&
                      (msg.seen ? (
                        <img className="h-[15px]" alt="" srcSet="seen.svg" />
                      ) : (
                        <img className="h-[15px]" alt="" srcSet="unseen.svg" />
                      ))}
                  </div>
                </li>
              );
            })
          ) : (
            <p className="text-gray-400 text-center">No messages yet...</p>
          )}
          <div ref={bottomRef} className="h-[10px]"></div>
        </div>

        {/* Message Input */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[100%] md:w-[80%] bg-sky-950 rounded-full flex items-center px-2 py-2 shadow-lg">
          <input
            type="text"
            ref={message}
            placeholder="Type a message..."
            className="flex-grow bg-transparent outline-none text-white px-3"
          />
          <button
            onClick={send}
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 flex gap-1.5 text-white px-2 py-2 rounded-full"
          >
            <p className="font-bold">Send</p>
            <img alt="" src="/send.svg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
