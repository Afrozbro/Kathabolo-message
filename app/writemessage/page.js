

"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Puff } from "react-loader-spinner";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

// 🟢 This is your actual page content logic
function WriteMessageContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const reciver = searchParams.get("reciver");
  const sender = searchParams.get("sender");
  const [messagehistory, setmessagehistory] = useState([]);
  const message = useRef();
  const bottomRef = useRef();

  const [userdetail, setUserdetail] = useState({
    username: "",
    name: "",
    email: "",
    profileicon: "",
  });

  const [dp, setDp] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [detitem, setdetitem] = useState(null);
  const [dltpopup, setdltpopup] = useState(false);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!session) router.push("/signin");
  }, [session]);

  // ✅ Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/sendmessage?sender=${sender}&reciver=${reciver}`
        );
        const data = await res.json();
        if (data.success) setmessagehistory(data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [sender, reciver]);

  // ✅ Send message
  const send = async () => {
    const sharemessage = message.current.value.trim();
    if (!sharemessage) {
      toast.error("Please enter a message");
      return;
    }

    const mymessage = { sender, reciver, sharemessage, seen: false };
    const res = await fetch("/api/sendmessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mymessage),
    });

    const data = await res.json();
    if (data.success) message.current.value = "";
    else toast.error("Message not sent");
  };

  // ✅ Delete message
  const deleteMessage = async (id) => {
    try {
      const res = await fetch("/api/delmess", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (res.ok) {
        setdltpopup(false);
        setdetitem(null);
        toast.success("✅ Message deleted");
      } else {
        toast.error("❌ Message not deleted");
      }
    } catch (err) {
      toast.error("❌ Message not deleted");
    }
  };

  // ✅ Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messagehistory]);

  // ✅ Mark unseen messages as seen
  useEffect(() => {
    const markUnseenAsSeen = async () => {
      const unseenMessages = messagehistory.filter(
        (msg) => msg.sender !== sender && !msg.seen
      );
      if (unseenMessages.length > 0) {
        try {
          await fetch("/api/updateseen", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: unseenMessages }),
          });
        } catch (error) {
          // console.error("❌ Error updating seen:", error);
        }
      }
    };
    markUnseenAsSeen();
  }, [messagehistory]);

  // ✅ Fetch receiver details
  const fetchUserdetils = async (reciver) => {
    try {
      const res = await fetch(
        `/api/userbyusername?username=${encodeURIComponent(reciver)}`
      );
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
    } catch (err) {
      // console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchUserdetils(reciver);
  }, [messagehistory]);

  // ✅ Reply feature
  const Reply = (msg) => {
    if (msg.startsWith("Reply")) {
      let repvalue = `Reply: ${msg.split("-")[1]?.trim()} :-`;
      message.current.value = repvalue;
    } else {
      let repvalue = `Reply: ${msg} :- `;
      message.current.value = repvalue;
    }
  };

  // ✅ Show / hide image popup
  const showdp = (e) => {
    setDp(e);
    setShowPopup(true);
  };
  const closepop = () => setShowPopup(false);

  // ✅ Delete popup controls
  const showdltpopup = (id) => {
    setdetitem(id);
    setdltpopup(true);
  };
  const hidedltpopup = () => {
    setdltpopup(false);
    setdetitem(null);
  };

  // ✅ Loading spinner
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

  // ✅ Main UI
  return (
    <div className="relative h-[50vh] text-white">
      {/* Profile Picture Popup */}
     <title>Kathabolo App - Write Message</title>
      <meta
        name="description"
        content="Kathabolo is a smart chatting and talking app that helps you connect instantly. Fast, secure, simple. Write messages with Kathabolo today!"
      />
      <meta
        name="keywords"
        content="kathabolo, chat app, talking app, messaging app, kathabolo beta, kathabolo netlify"
      />
      <meta name="author" content="Kathabolo Team" />
      <div
        className={`absolute z-100 h-[90%] lg:h-[100%] w-[90%] lg:w-[25%] 
          left-[5%] lg:left-[35%] top-[30%] bg-black/70 rounded-2xl shadow-2xl flex items-center justify-center
          transform transition-all duration-300 ease-out ${
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

      {/* Delete confirmation popup */}
<div
  className={`deletemsg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
  h-auto min-h-[18vh] w-[90vw] sm:w-[70vw] md:w-[45vw] lg:w-[25vw]
  bg-gradient-to-br from-slate-900 to-blue-700 
  rounded-2xl shadow-lg p-5 flex flex-col items-center justify-center gap-4 
  ${dltpopup ? "flex" : "hidden"}`}
>
  <h1 className="text-xl md:text-2xl font-semibold text-white text-center">
    Delete this message?
  </h1>

  <div className="flex items-center justify-center gap-6 w-full mt-2">
    <button
      onClick={() => deleteMessage(detitem)}
      className="py-2.5 cursor-pointer px-6 text-sm md:text-base font-medium bg-white rounded-full hover:bg-gray-100 text-gray-900 transition-all"
    >
      Delete
    </button>
    <button
      onClick={hidedltpopup}
      className="py-2.5 cursor-pointer px-6 text-sm md:text-base font-medium bg-white rounded-full hover:bg-gray-100 text-gray-900 transition-all"
    >
      Cancel
    </button>
  </div>
</div>



      {/* Chat section */}
      <div
        className={`${
          showPopup
            ? "blur-sm pointer-events-none"
            : "blur-none pointer-events-auto"
        }`}
      >
        {/* Header */}
        <div className="h-[7vh] sticky top-0 z-50 p-2 rounded-2xl bg-slate-800 flex items-center justify-around">
          <div className="profile flex items-center gap-2.5">
            <img
              onClick={() => showdp(userdetail.profileicon)}
              className="h-[45px] md:h-[50px] md:w-[50px] rounded-full cursor-pointer"
              alt="profile-icon"
              srcSet={userdetail.profileicon}
            />
            <div className="username text-2xl font-bold">{reciver}</div>
          </div>
        </div>

        {/* Messages */}
        <div className="mess h-[75vh] w-full overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-blue flex flex-col gap-2.5 my-2.5">
          {messagehistory.length > 0 ? (
            messagehistory.map((msg) => {
              const isMe = msg.sender === sender;
              return (
                <li
                  key={msg._id}
                  className={`list-none p-2 rounded-lg w-fit max-w-[70%] ${
                    isMe
                      ? "self-end bg-blue-600 text-white"
                      : "self-start bg-slate-900 text-gray-200"
                  }`}
                >
                  {msg.sharemessage}{" "}
                  {isMe && (
                    <button
                      onClick={() => showdltpopup(msg._id)}
                      className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <Trash2 className="cursor-pointer" size={14} />
                    </button>
                  )}
                  {!isMe && (
                    <img
                      onClick={() => Reply(msg.sharemessage)}
                      className="h-[25px] relative -top-[50%] left-[105%]"
                      alt=""
                      srcSet="reply.svg"
                    />
                  )}
                  <div className="flex justify-end gap-5">
                    <p className="text-[10px]">
                      {new Date(msg.timestamp).toLocaleTimeString("en-IN", {
                        hour12: true,
                        timeZone: "Asia/Kolkata",
                      })}
                    </p>
                    <p className="text-[10px]">
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
          <div ref={bottomRef} className="h-[10px]" />
        </div>

        {/* Input */}
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
}

// 🟡 Page wrapper with Suspense boundary
export default function Page() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <WriteMessageContent />
    </Suspense>
  );
}

// 🟢 Force dynamic rendering
export const dynamic = "force-dynamic";
