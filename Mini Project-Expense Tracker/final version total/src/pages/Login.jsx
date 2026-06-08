import React, { useEffect, useState, useCallback, Suspense } from "react";
import "../styling/styling.css";
import welcomeImage from "/images/loginimage.png";
import { userService } from "/src/services/userServices";
import { useNavigate, Link } from "react-router-dom";
import { MdRocketLaunch } from "react-icons/md";
//test login using
//the below credentials are only to test the website and are not to be made public 
//username:Nikhil,password:Sigmoid@321
//lazily loading the 2 fields of the login page and have also given apporpraite fallback UI using suspense tag
const UsernameField = React.lazy(() =>
  import("../components/UsernameField") //the two fields are inside the components folder 
);
const PasswordField = React.lazy(() =>
  import("../components/PasswordField")
);

function Login() {//creating a navigation object using useNavigste() hook in order to do navigation
  const navigate = useNavigate();
  //declaring state variables for the two fields as well as the toggling state of show passowrd 
  //which decides whether to dispay the faeye react icon or faeyeslashed react icon based on toglle state 
  //one more state variable which sill store the error
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    //upon opening of login page the useeffect hook wrapped functionality verifies if user has already signed up recently
    //in such a case the application autofills their username on the username field oflogin page 
    //signedinuser only stores username not password 
    const user = localStorage.getItem("signedinuser");
    if (!user) return;
    // a timeout is set because code wrapped in useeffect actually executes slightly before complete rendering of the page
    //thus 500ms after complete load of page the code executes 
    const timerId = setTimeout(() => {
      alert("auto-filling your details");
      const details = JSON.parse(user);
      setUsername(details.username || "");
    }, 500);

    return () => clearTimeout(timerId);//clearing out the timeout using a clean up function here in order to ensure the application functions
    //in an optimized manner without a cleanup function a new timeout is createed again and again making unnecessary. use of resources and memory is wasted
  }, []);

  //the handler functions for the username field,the password field the form submission and the toggling of password are wrapped in usecallback for stable function references 
  //so that new parent rerender->new props->new function of child this p rocess wont happen 
  const handleUsernameChange = useCallback((e) => {
    setError("");
    setUsername(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setError("");
    setPassword(e.target.value);
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      try {
        const users = await userService.getAllUsers();
        //find function done on users retrieved from getallusers api endpoint in order to check if account with that username is thers
      
        const foundUser = users.find(
          (user) => user.username === username
        );

        if (!foundUser) {
          //if no user with that username exists then throw error but dont say if it is passwordor username error
          throw new Error("Invalid username or password");
        }
        //this is an api call to the loginUser endpoint whih makes use json server auth middle ware declared in server.cjs file itself 
        await userService.loginUser({
            email: foundUser.email,   // Use the email signup saved
              password: password
        });
        localStorage.setItem(//setting user details in local storage for reuse later on in the sidebar of dashboard to display profile details 
          "userdetails",
          JSON.stringify({
            username,
            email: foundUser.email,
            selectedProfile: foundUser.selectedProfile,
          })
        );
          //upon succesful login directly go to dashboard
          //will make changes of including forgot password,real time error check for onchange event which will
          //  be debounced so that error will show only when user will stop typing 
        navigate("/dashboard");
      } catch (err) {//catch block gracefully handle errors and display error message appropriately 
        setError(err.message || "Login failed");
      }
    },
    [username,password ,navigate]
  );

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
      {/* below is righthalf with the various fields  */}

      <div className="righthalf" style={{ position: "relative" }}>
        {/* Rocket - Decorative icon */}
        {/* inline css styling in order to avoid conflicts with rest of codebase */}
        <MdRocketLaunch
          size={28}
          style={{
            position: "absolute",
            top: "30px",
            left: "45vw",
            color: "indigo",
            zIndex: 20,
          }}
          className="loginrocket"
          aria-hidden="true"
        />

        <div
          className="formcontainer"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1rem", paddingBottom: "1rem" }}>
            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#475569",
                lineHeight: "1.4",
                maxWidth: "380px",
              }}
            >
              "Master your money, master your life."
            </div>
            <div style={{ fontSize: "0.85rem", color: "#64748b", fontStyle: "italic", marginTop: "0.25rem" }}>
              — Tony Robbins
            </div>
          </div>

          <h2
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#1e293b",
              fontSize: "1.6rem",
              fontWeight: "700",
              margin: "0 0 1.5rem 0",
            }}
          >
            Welcome back! Ready to track your spending?
          </h2>
{/* suspense fallback UI is created here which is basic loading form text with padding and a color to show  */}
          <Suspense fallback={
            <div 
              style={{ padding: "12px", color: "#64748b" }} 
              aria-label="Loading login form"
            >
              Loading form…
            </div>
          }>
            {/* on submitting the form as well certain actions occur */}
            {/* below are the calls to the react.memoed child components where we re passsing props to them */}
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>
              <UsernameField 
                value={username} 
                onChange={handleUsernameChange} 
                error={error} 
              />

              <PasswordField
                value={password}
                onChange={handlePasswordChange}
                showPassword={showPassword}
                onToggle={togglePassword}
                error={""}
              />

              <button 
                type="submit" 
                className="buttonclass"
                role="button"
                aria-label="Sign in to your account"
              >
                Login
              </button>
            </form>
          </Suspense>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            {/* below is a loink which is user friendly and allows the user to go to the signup page it is styled appropriately as well  */}
            <Link 
              to="/signup" 
              style={{ color: "#64748b", textDecoration: "none", fontWeight: "500" }}
              role="navigation"
              aria-label="Go to signup page"
            >
              Don't have an account?{' '}
              <span style={{ color: "#2563eb", fontWeight: "600" }} className="spanclass">
                Signup here
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
