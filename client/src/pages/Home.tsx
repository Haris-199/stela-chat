import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>
          <Link to={"/Login"}>Login</Link>
        </li>
        <li>
          <Link to={"/Register"}>Register</Link>
        </li>
        <li>
          <Link to={"/Chat"}>Chat</Link>
        </li>
        <li>
          <Link to={"/Profile"}>Profile</Link>
        </li>
      </ul>
      <h1 className="bg-blue-300">Home</h1>
    </>
  );
}
