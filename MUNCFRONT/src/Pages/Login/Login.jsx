import React, { useEffect, useState } from "react";
import "./Login.css";
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../../img/AuthPage/LoginPage.jpeg";
import KASPLOGO from "../../img/kasper.png";
import { useSelector } from "react-redux";
import { dispatch } from "../../redux/store";
import { loginUser } from "../../redux/slices/loginSlice.js";
import { jwtDecode } from "jwt-decode"; // Fixed import
import { persistStore } from "redux-persist";
import { store } from "../../redux/store";
import toast from "react-hot-toast";
const Login = (props) => {
  const persistor = persistStore(store);

  const { loginError } = useSelector((state) => state.login);
  const { userData } = useSelector((state) => state.user);
  const [alertMsg, setAlertMsg] = useState("");
  const [seePass, setSeePass] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodeToken = (token) => {
    const parts = token.split(".");
    if (parts.length !== 3) {
      localStorage.clear();
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      localStorage.clear();
      return null;
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false); // No token, stop loading
      return;
    }

    const decodedToken = decodeToken(token);

    if (!decodedToken) {
      localStorage.clear();
      setLoading(false); // Invalid token, stop loading
      return;
    }

    if (userData && token) {
      if (userData.Account === 3) {
        navigate("/employee/dashboard");
      } else if (userData.Account === 2) {
        navigate("/hr/dashboard");
      } else if (userData.Account === 1) {
        navigate("/admin/dashboard");
      } else if (userData.Account === 4) {
        navigate("/manager/dashboard");
      } else {
        navigate("/404");
      }
    }

    setLoading(false); // Stop loading after validation
  }, [userData, navigate]);
  useEffect(() => {
    if (!token) return;
    const decodedTokenValue = decodeToken(token);
    let timout = setTimeout(() => {
      if (!decodedTokenValue) {
        localStorage.clear();
        setLoading(false); // Invalid token, stop loading
        return;
      }

      if (userData && token) {
        if (userData.Account === 3) {
          navigate("/employee/dashboard");
        } else if (userData.Account === 2) {
          navigate("/hr/dashboard");
        } else if (userData.Account === 1) {
          navigate("/admin/dashboard");
        } else if (userData.Account === 4) {
          navigate("/manager/dashboard");
        } else {
          navigate("/404");
        }
      }
    }, 500);

    return () => clearTimeout(timout);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const bodyLogin = {
      email: event.target[0].value.trim().toLowerCase(),
      password: event.target[1].value,
    };

    dispatch(loginUser(bodyLogin))
      .unwrap()
      .then((data) => {
        if (data.Account === 3) {
          navigate("/employee/dashboard");
        } else if (data.Account === 2) {
          navigate("/hr/dashboard");
        } else if (data.Account === 1) {
          navigate("/admin/dashboard");
        } else if (data.Account === 4) {
          navigate("/manager/dashboard");
        }
      })
      .catch((error) => {
        toast.error(error);
      });

    event.target.reset();
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state to prevent premature redirect
  }

  return (
    <div
      style={{ height: "100vh", width: "100%", overflow: "auto" }}
      className="m-0 p-0 bg-light"
    >
      <div
        style={{ height: "100%", width: "100%" }}
        className="row flex-row-reverse mx-auto bg-white"
      >
        <div
          style={{ height: "100%" }}
          className="col-12 col-md-4 position-relative px-0 p-md-5  d-flex bg-white flex-column justify-content-center align-items-center"
        >
          <form
            style={{ height: "fit-content", zIndex: "1" }}
            onSubmit={handleSubmit}
            className="form my-auto bg-white py-5 px-4 p-md-3 rounded text-black fw-bold d-flex flex-column justify-content-center"
          >
            <div className="d-flex justify-content-center align-items-center">
              <img
                style={{ width: "15rem", height: "auto" }}
                src={KASPLOGO}
                className="mx-auto"
                alt=""
              />
            </div>
            <h4
              style={{ color: "var(--primaryDashColorDark)" }}
              className="my-4 text-center text-md-start gap-2"
            >
              Sign In
            </h4>
            <div className="d-flex flex-column my-3">
              <label htmlFor="email" className="ps-2 fw-normal">
                Account
              </label>
              <input
                name="email"
                placeholder="Email Address, Phone or UserID"
                className="login-input border my-0"
                type="text"
              />
            </div>

            <div className="d-flex position-relative flex-column my-3 mb-4 mb-md-3">
              <label htmlFor="password" className="ps-2 fw-normal">
                Enter your password
              </label>
              <div className="position-relative">
                <input
                  name="password"
                  placeholder="**********"
                  className="login-input border my-0"
                  type={seePass ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-55%)",
                    right: "3%",
                    cursor: "pointer",
                  }}
                  className="fs-5 text-muted my-0"
                  onClick={(e) => {
                    e.preventDefault();
                    setSeePass(!seePass);
                  }}
                >
                  {seePass ? <GoEyeClosed /> : <RxEyeOpen />}
                </span>
              </div>
            </div>

            <div className="row mx-auto w-100 justify-content-between my-3 row-gap-4">
              <input
                style={{
                  background: "var(--primaryDashColorDark)",
                  color: "var(--primaryDashMenuColor)",
                }}
                type="submit"
                className="btn btn-primary"
                value=" Login"
              />
              <Link
                to="/forgetPassword"
                className="fw-normal text-decoration-none"
                style={{ cursor: "pointer" }}
              >
                Forgot password?
              </Link>
            </div>

            <p
              style={{
                position: "absolute",
                bottom: "0",
                left: "50%",
                transform: "translate(-50%)",
                fontWeight: "normal",
                whiteSpace: "pre",
              }}
              className="d-block text-center text-black"
            >
              Design and Developed by{" "}
              <a
                style={{ textDecoration: "none" }}
                target="_blank"
                href="https://kasperinfotech.com/"
              >
                Kasper Infotech Pvt. Ltd.
              </a>
            </p>
          </form>
        </div>
        <div
          style={{
            height: "100%",
            zIndex: "0",
            backgroundImage: `url(${LoginImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
          className="imagePosition col-12 col-md-8 p-5 d-flex flex-column justify-content-center gap-4"
        >
          <p
            style={{ position: "absolute", bottom: "10px" }}
            className="text-center d-none d-md-flex pt-5 text-white"
          >
            www.kasperinfotech.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
