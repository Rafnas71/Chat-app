export default function ChatPage(){
    return(
        <div className="flex h-screen">
        <div className="w-1/3 bg-slate-50">contacts</div>
        <div className="w-2/3 bg-blue-100 flex flex-col gap-2 p-2">
          <div className="flex-grow">Messages</div>
          <div className="flex gap-2">
            <input type="text" placeholder="Type your messages here" className="rounded-md p-2 flex-grow" />
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
    )
}