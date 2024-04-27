import { FcGoogle } from "react-icons/fc";

function Header() {
  return (
    <div className="header">
      <div className="title">NOTE TAKER</div>
      <div className="signin">
        <div>To save the notes, sign in with</div>
        <div className="google-icon">
          <FcGoogle style={{ fontSize: "25px" }} />
          oogle
        </div>
      </div>
    </div>
  );
}

export default Header;
