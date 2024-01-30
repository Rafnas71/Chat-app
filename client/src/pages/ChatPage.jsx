import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "../Components/Avatar";
import Logo from "../Components/Logo";
import { UserContext } from "../UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "../Components/Contact";

export default function ChatPage() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id } = useContext(UserContext);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const divUnderMessage = useRef();

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected. Trying to reconnect");
        connectToWs();
      }, 1000);
    });
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    // console.log({ ev, messageData });
    if ("online" in messageData) {
      showPeopleOnline(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }

  function sendMessage(ev) {
    ev.preventDefault();
    ws.send(
      JSON.stringify({
        recepient: selectedUserId,
        text: newMessageText,
      })
    );

    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: id,
        recepient: selectedUserId,
        _id: Date.now(),
      },
    ]);
    setNewMessageText("");
  }

  //Auto Scroll after new message
  useEffect(() => {
    const div = divUnderMessage.current;
    if (div) {
      div.scrollIntoView({ behaviour: "smooth", block: "end" });
    }
  }, [messages]);

  //fetching message history from db
  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        const { data } = res;
        setMessages(data);
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
  },[onlinePeople]);
  // console.log(offlinePeople);

  function showPeopleOnline(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  const onlinePeopleExcludeOurUser = onlinePeople;
  delete onlinePeopleExcludeOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, "_id");
  // console.log(messagesWithoutDupes);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-slate-50 ">
        <Logo />
        {Object.keys(onlinePeopleExcludeOurUser).map((userId) => (
          <Contact
            key={userId}
            userId={userId}
            username={onlinePeopleExcludeOurUser[userId]}
            onClick={() => setSelectedUserId(userId)}
            selected={userId === selectedUserId}
            online={true}
          />
        ))}
        {Object.keys(offlinePeople).map((userId) => (
          <Contact
            key={userId}
            userId={userId}
            username={offlinePeople[userId].username}
            onClick={() => setSelectedUserId(userId)}
            selected={userId === selectedUserId}
            online={false}
          />
        ))}
      </div>
      <div className="w-2/3 bg-blue-100 flex flex-col gap-2 p-2 ">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="h-full flex flex-grow items-center justify-center">
              <div className="text-gray-400">
                &larr; Select a person from contacts
              </div>
            </div>
          )}
          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 bottom-2 right-0 left-0">
                {messagesWithoutDupes.map((message) => (
                  <div
                    key={message._id}
                    className={
                      message.sender === id ? "text-right" : "text-left"
                    }
                  >
                    <div
                      className={
                        "inline-block m-2 p-2 rounded-md text-sm " +
                        (message.sender === id
                          ? "bg-green-500 text-white"
                          : "bg-white text-gray-700")
                      }
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessage}></div>
              </div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className="flex gap-2 " onSubmit={sendMessage}>
            <input
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              type="text"
              placeholder="Type your messages here"
              className="rounded-md p-2 flex-grow"
            />
            <button className="bg-blue-700 text-white p-1 rounded-md ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                dataSlot="icon"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
