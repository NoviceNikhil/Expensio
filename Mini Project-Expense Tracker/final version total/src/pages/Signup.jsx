import React, { useState, useCallback, Suspense } from "react";
import "../styling/styling.css";
import welcomeImage from "/images/signupimage.png";
import { userService } from "/src/services/userServices";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MdRocketLaunch } from "react-icons/md";

//test signup using
//the below credentials are only to test the website and are not to be made public
//username:Nikhil,password:Sigmoid@321,email:nikhil@gmail.com
//lazily loading the 3 fields of the signup page and have also given apporpraite fallback UI using suspense tag
const UsernameField = React.lazy(() => import("../components/UsernameField"));
const PasswordField = React.lazy(() => import("../components/PasswordField"));
const EmailField = React.lazy(() => import("../components/EmailField"));

function Signup() {
  //creating a navigation object using useNavigste() hook in order to do navigation
  const navigate = useNavigate();
  //declaring state variables for the three fields as well as the toggling state of show passowrd
  //which decides whether to dispay the faeye react icon or faeyeslashed react icon based on toglle state
  //one more state variable which sill store the error for username and password respectively
  //selectedProfile state manages which profile picture is selected (0 means none selected)
  const [username, setUsername] = useState("");
  const [email, setEmailid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //array containing all the profile pictures with their respective paths and alt text
  //used to render the profile picture selection grid
  const profilePictures = [
    { id: 1, src: "/images/profilepictures/boy.png", alt: "Profile 1" },
    { id: 2, src: "/images/profilepictures/man.png", alt: "Profile 2" },
    { id: 3, src: "/images/profilepictures/woman.png", alt: "Profile 3" },
    { id: 4, src: "/images/profilepictures/purplehair.png", alt: "Profile 4" },
  ];

  //the handler functions for the username field,the email field,the password field the form submission and the toggling of password are wrapped in usecallback for stable function references
  //so that new parent rerender->new props->new function of child this p rocess wont happen
  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const handleEmailChange = useCallback((e) => {
    setEmailid(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  //custom validation function for username which checks regex pattern and blocks weak/common usernames
  //returns object with isValid boolean and error message if invalid
  function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_\.\-]{2,19}$/;

    if (!usernameRegex.test(username)) {
      return {
        isValid: false,
        message: "3-20 chars, letters/numbers/_/./- (start with letter)",
      };
    }

    const weakUsernames = ["admin", "user", "test", "root"];
    if (weakUsernames.includes(username.toLowerCase())) {
      return {
        isValid: false,
        message: "Avoid common names like 'admin', 'user'",
      };
    }

    return { isValid: true, message: "" };
  }

  //custom validation function for password which enforces minimum length and character variety requirements
  //uppercase,lowercase,number,special character all required
  function validatePassword(password) {
    if (password.length < 8) {
      return {
        isValid: false,
        message: "Minimum 8 characters",
      };
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return {
        isValid: false,
        message: "1 uppercase, 1 lowercase, 1 number, 1 special (!@#$...)",
      };
    }

    return { isValid: true, message: "" };
  }

  //main form submission handler which first validates all fields client side
  //then checks if username already exists via getAllUsers API call
  //if all good creates user via createUser API endpoint and stores username in localStorage for autofill on login
  function handleSubmit(e) {
    e.preventDefault();
    setUsernameError("");
    setPasswordError("");

    const usernameResult = validateUsername(username);
    const passwordResult = validatePassword(password);

    if (!usernameResult.isValid) {
      setUsernameError(usernameResult.message);
      return;
    }

    if (!passwordResult.isValid) {
      setPasswordError(passwordResult.message);
      return;
    }

    if (selectedProfile === 0) {
      alert("Please choose a profile picture");
      return;
    }

    userService
      .getAllUsers()
      .then((result) => {
        if (
          result.find(
            (user) => user.username.toLowerCase() === username.toLowerCase(),
          )
        ) {
          setUsername("");
          throw new Error("A user with that username already exists");
        }
      })
      .then(() => {
        return userService
          .createUser({ username, email, password, selectedProfile })
          .then((res) => {
            //storing only username in localStorage (not password) so that login page can autofill username field
            localStorage.setItem("signedinuser", JSON.stringify({ username }));
            navigate("/");
          });
      })
      .catch((err) => {
        console.error("Full error:", err);
        alert(`Error encountered: ${err.message || err}`);
      });
  }

  return (
    <div className="container">
      <div className="lefthalf">
        <div className="purple-circle">
          <img
            src={welcomeImage} //welcome image on left half of the page
            alt="Welcome"
            className="welcomeimage"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="righthalf" style={{ position: "relative" }}>
        {/* Rocket Launch - Decorative icon */}
        {/* inline css styling in order to avoid conflicts with rest of codebase */}
        {/* positioned on right side for signup page to differentiate from login rocket on left */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            zIndex: 20,
          }}
          aria-hidden="true"
        >
          <MdRocketLaunch
            size={28}
            style={{ color: "indigo" }}
            className="signuprocket"
            aria-hidden="true"
          />
        </div>

        <div
          className="formcontainer"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingTop: "8px",
          }}
        >
          {/* motivational quote and title above the form similar to login page styling */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#475569",
                lineHeight: "1.3",
                maxWidth: "350px",
              }}
            >
              "Every dollar counts."
            </div>
            <h2
              style={{
                textAlign: "center",
                marginBottom: "0.8rem",
                color: "#1e293b",
                fontSize: "1.5rem",
                fontWeight: "700",
                margin: "0 0 1.5rem 0",
              }}
            >
              Start tracking today
            </h2>
          </div>

          {/* profile picture selection grid with glassmorphism styling and accessibility features */}
          {/* each profile pic is clickable with keyboard navigation support and visual feedback */}
          {/* green checkmark indicator shows selected profile with smooth animations */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "2rem",
              padding: "16px 24px",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderRadius: "20px",
              border: "2px solid #e2e8f0",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            {profilePictures.map((profile) => (
              <div
                key={profile.id}
                role="button"
                tabIndex={0}
                aria-label={`Select ${profile.alt} profile picture`}
                aria-pressed={selectedProfile === profile.id}
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  padding: "4px",
                  background:
                    selectedProfile === profile.id
                      ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                      : "rgba(255,255,255,0.8)",
                  border:
                    selectedProfile === profile.id
                      ? "4px solid rgba(255,255,255,0.9)"
                      : "2px solid transparent",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    selectedProfile === profile.id
                      ? "0 12px 40px rgba(37, 99, 235, 0.4)"
                      : "0 4px 16px rgba(0,0,0,0.08)",
                  transform:
                    selectedProfile === profile.id ? "scale(1.05)" : "scale(1)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => setSelectedProfile(profile.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProfile(profile.id);
                  }
                }}
              >
                <img
                  src={profile.src}
                  alt=""
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    transition: "all 0.3s ease",
                  }}
                  aria-hidden="true"
                />
                {selectedProfile === profile.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "20px",
                      height: "20px",
                      background: "#10b981",
                      borderRadius: "50%",
                      border: "3px solid white",
                      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>

          {/* suspense fallback UI is created here which is basic loading form text with padding and a color to show  */}
          <Suspense
            fallback={
              <div
                style={{
                  padding: "12px",
                  color: "#64748b",
                  textAlign: "center",
                  width: "100%",
                  maxWidth: "400px",
                }}
                aria-label="Loading signup form"
              >
                Loading form…
              </div>
            }
          >
            {/* on submitting the form as well certain actions occur */}
            {/* below are the calls to the react.memoed child components where we re passsing props to them */}
            <form
              onSubmit={handleSubmit}
              style={{ width: "100%", maxWidth: "400px" }}
            >
              <UsernameField
                value={username}
                onChange={handleUsernameChange}
                error={usernameError}
              />

              <EmailField value={email} onChange={handleEmailChange} />

              <PasswordField
                value={password}
                onChange={handlePasswordChange}
                showPassword={showPassword}
                onToggle={togglePassword}
                error={passwordError}
              />

              <button
                type="submit"
                className="buttonclass"
                role="button"
                aria-label="Create account"
              >
                Signup
              </button>
            </form>
          </Suspense>

          {/* below is a loink which is user firiendly and allows the user to go to the login page it is styled appropriately as well  */}
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link
              to="/"
              style={{
                color: "#64748b",
                textDecoration: "none",
                fontWeight: "500",
              }}
              role="navigation"
              aria-label="Go to login page"
            >
              Already have an account?{" "}
              <span style={{ color: "#2563eb", fontWeight: "600" }}>
                Login here
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
