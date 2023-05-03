import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/SignUp";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <div
        style={{
          textAlign: "center",
          padding: "1rem 2rem",
          width: "100%",
          backgroundColor: "white",
          margin: "40px 0 15px 0",
          fontSize: "2rem",
          borderRadius: "5px",
          fontFamily: "Ysabeau",
        }}>
        Talk-To-Me
      </div>
      <div
        style={{
          background: "white",
          width: "100%",
          padding: "1rem",
          borderRadius: "5px",
          borderWidth: "1px",
        }}>
        <Tabs position="relative" variant="unstyled">
          <TabList mb={"5px"}>
            <Tab w={"50%"}>Login</Tab>
            <Tab w={"50%"}>Sign Up</Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            backgroundColor="blue"
            borderRadius="1px"
          />
          <TabPanels mt={"1rem"}>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </Container>
  );
};

export default HomePage;
