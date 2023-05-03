import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./LoginSignup.module.css";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  let navigate = useNavigate();

  const toast = useToast();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an Image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Talk-to-me");
      data.append("cloud_name", "dxzqx4lbi");
      fetch("https://api.cloudinary.com/v1_1/dxzqx4lbi/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill the required field",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password does not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Registration successfull",
        description: "Proceed with Login",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (err) {
      toast({
        title: "Error Occured",
        description: err.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ margin: "5px 0" }} id="first-name">
        <label>Name</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div style={{ margin: "5px 0" }} id="email">
        <label>Email</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter Your Email"
          id="email_input"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div style={{ margin: "5px 0" }} id="password">
        <label>Password</label>
        <div style={{ position: "relative" }}>
          <input
            className={styles.input}
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            id="email_password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className={styles.showButton}
            h="1.75rem"
            size="sm"
            onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div style={{ margin: "5px 0" }} id="confirm-password">
        <label>Confirm Password</label>
        <div style={{ position: "relative" }}>
          <input
            className={styles.input}
            type={show ? "text" : "password"}
            placeholder="Confirm Your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            className={styles.showButton}
            h="1.75rem"
            size="sm"
            onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div style={{ margin: "5px 0" }} id="pic">
        <label>Upload Image</label>
        <input
          className={styles.input}
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </div>
      <button className={styles.signupButton} onClick={submitHandler}>
        Sign Up
      </button>
    </>
  );
};

export default SignUp;
