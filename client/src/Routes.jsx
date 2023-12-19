import { useContext } from "react";
import RegisterAndLoginPage from "./pages/RegisterAndLoginPage";
import { UserContext } from "./UserContext";
import ChatPage from "./pages/ChatPage";

const Routes = () => {
  const { username, id } = useContext(UserContext);

  if (username) {
    return (
      <ChatPage/  >
    );
  }

  return (
    <div>
      <RegisterAndLoginPage />
    </div>
  );
};

export default Routes;