import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useAuth } from "../utils/auth";
import { Form, InputGroup } from "../components/LoginForm";
import swal from "sweetalert";

const loginStyle = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  maxWidth: "20rem",
  margin: "0 auto",
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, login } = useAuth();
  const history = useHistory();

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();

    login(email, password)
      // navigate to the profile page
      .then(() => history.push("/"))
      .catch((err) => {
        swal({
          title: "Login Unsuccessful",
          text: err.response.data.message,
          icon: "warning",
          button: "OK",
        });
      });
  };

  return (
    <div style={loginStyle}>
      <h1>Login</h1>
      <Form onSubmit={handleFormSubmit}>
        <InputGroup
          id="email"
          labelText="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ backgroundColor: "#16162a",
            border: "2px solid #6565C2",
            color: "white", }}
        />
        <InputGroup
          id="password"
          labelText="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{backgroundColor: "#16162a",
            border: "2px solid #6565C2",
            color: "white", }}
        />
        <button type="submit" class="border-gradient border-gradient-purple submit-button">
          Submit
        </button>
      </Form>
      <Link
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
        }}
        to="/signup"
      >
        Go to Signup
      </Link>
    </div>
  );
}

export default Login;
