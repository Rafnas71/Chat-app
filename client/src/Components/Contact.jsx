/* eslint-disable react/prop-types */
import Avatar from "./Avatar";

const Contact = ({userId,username,onClick,selected,online}) => {
  return (
    <div
      onClick={() => onClick(userId)}
      className={
        "border h-12 border-gray-100 py-2 flex gap-2 items-center cursor-pointer " +
        (selected ? "bg-green-100" : "")
      }
      key={userId}
    >
      {selected && (
        <div className="w-1 h-12 bg-blue-500 rounded-r-md"></div>
      )}
      <div className="flex gap-2 items-center pl-4 py-2">
        {" "}
        <Avatar online={online} username={username} userId={userId} />
        <span className="text-gray-800 ">{username}</span>{" "}
      </div>
    </div>
  );
};

export default Contact;
