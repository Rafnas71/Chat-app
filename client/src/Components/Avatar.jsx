/* eslint-disable react/prop-types */

const Avatar = ({ username, userId, online }) => {
  const colors = [
    "bg-red-200",
    "bg-yellow-200 ",
    "bg-blue-200 ",
    "bg-green-200 ",
    "bg-purple-200 ",
    "bg-teal-200 ",
  ];
  const userIdBase10 = parseInt(userId, 10);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  return (
    <div
      className={
        "border  w-8 h-8 rounded-full flex items-center relative " + color
      }
    >
      <div className="text-center w-full opacity-70 ">
        {username[0].toUpperCase()}{" "}
      </div>
      {online ? (
        <div className="absolute bg-green-500 w-2.5 h-2.5 right-0 bottom-0 rounded-full"></div>
      ) : (
        <div className="absolute bg-gray-400 w-2.5 h-2.5 right-0 bottom-0 rounded-full"></div>
      )}    
    </div>
  );
};

export default Avatar;
