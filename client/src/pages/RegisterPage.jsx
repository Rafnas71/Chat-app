import { useState } from "react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form action="" className=" w-full max-w-sm mx-auto my-auto mb-30">
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="username"
          className="w-full p-3 block rounded-lg  mb-2 border"
        />
        <input
          value={password}
          onChange={ev=>setPassword(ev.target.value)}
          type="password"
          placeholder="password"
          className="w-full p-3 block rounded-lg mb-2 border"
        />
        <button className=" block bg-blue-500 text-white w-full p-3 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
