import AuthModule from "../Authentication/Auth.js";
import Logo from "../../Images/Logo.png"

const Main = () => {
  return (
    <div>
      <h1>Welcome to Pocket Pal! </h1>
      <AuthModule />
    </div>
  );
}

export default Main;