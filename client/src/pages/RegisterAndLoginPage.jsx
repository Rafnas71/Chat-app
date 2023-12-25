import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

const RegisterAndLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedInOrRegister, setLoggedInOrRegister] = useState("register");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = isLoggedInOrRegister;
    const { data } = await axios.post(url, { username, password });
    setLoggedInUsername(data.username);
    setId(data.id);
    
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form
        onSubmit={handleSubmit}
        className=" w-full max-w-sm mx-auto my-auto mb-30"
      >
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="username"
          className="w-full p-3 block rounded-lg  mb-2 border"
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          placeholder="password"
          className="w-full p-3 block rounded-lg mb-2 border"
        />
        <button className=" block bg-blue-500 text-white w-full p-3 rounded-lg">
          {isLoggedInOrRegister === 'register' ? "Register" : "Login"} 
        </button>
        <div className="text-center mt-2">
          {isLoggedInOrRegister === "register" ? (
            <div>
              {" "}
              Already a Member?{" "}
              <button
                className="underline text-gray-500"
                onClick={() => setLoggedInOrRegister("login")}
              >
                Login
              </button>
            </div>
          ) : (
            <div>
              Don't have an account{" "}
              <button className="underline text-gray-500" onClick={() => setLoggedInOrRegister("register")}>Register</button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterAndLoginPage;
