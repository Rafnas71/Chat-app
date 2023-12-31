import { useContext, useEffect, useState } from "react";
import Avatar from "../Components/Avatar";
import Logo from "../Components/Logo";
import { UserContext } from "../UserContext";

export default function ChatPage() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id } = useContext(UserContext);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showPeopleOnline(messageData.online);
    }
  }

  function showPeopleOnline(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  const onlinePeopleExcludeOurUser = onlinePeople;
  console.log(onlinePeopleExcludeOurUser);
  delete onlinePeopleExcludeOurUser[id];

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-slate-50 ">
        <Logo />
        {Object.keys(onlinePeopleExcludeOurUser).map((userId) => (
          <div
            onClick={() => setSelectedUserId(userId)}
            className={
              "border h-12 border-gray-100 py-2 flex gap-2 items-center cursor-pointer " +
              (userId === selectedUserId ? "bg-blue-100" : "")
            }
            key={userId}
          >
            {userId === selectedUserId && (
              <div className="w-1 h-12 bg-blue-500 rounded-r-md"></div>
            )}
            <div className="flex gap-2 items-center pl-4 py-2">
              {" "}
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span className="text-gray-800 ">
                {onlinePeople[userId]}
              </span>{" "}
            </div>
          </div>
        ))}
      </div>
      <div className="w-2/3 bg-blue-100 flex flex-col gap-2 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div  className= "h-full flex flex-grow items-center justify-center">
              <div className="text-gray-400">&larr; Select a person from contacts</div>          
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input
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
        </div>
      </div>
    </div>
  );
}
