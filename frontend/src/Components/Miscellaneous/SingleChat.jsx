import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvide";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../Modals/ProfileModal";
import { getSender, getSenderFull } from "../../Config/ChatLogics";
import UpdateGroupChatModal from "../Modals/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import animationData from "../../Animation/107605-typing.json";
import Lottie from "react-lottie";

// from the local host
// const ENDPOINT = "http://localhost:5000";

const ENDPOINT = "https://talktome-server.vercel.app/";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  async function fetchMessages() {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setMessages(data);
      setLoading(false);

      // To join the rooms
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  // To connect to Socket.io
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  // To Fetch Messages
  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat; // just to have a backup
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give Notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });
  // console.log(notification);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setMessages([...messages, data]);
        socket.emit("new message", data);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to send the Messages",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };

  function typingHandler(e) {
    setNewMessage(e.target.value);

    // typing indicator
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            width={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            p={"5px 10px"}>
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                <Text>{selectedChat.chatName.toUpperCase()}</Text>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            height={"100%"}
            width={"100%"}
            background={"#e8e8e8"}
            borderRadius={"lg"}
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            overflowY={"hidden"}
            p={3}>
            <ScrollableChat messages={messages} />
            {loading ? (
              <Spinner size={"xl"} margin={"auto"} />
            ) : (
              <FormControl onKeyDown={sendMessage} isRequired>
                {isTyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      height={60}
                      width={60}
                      style={{ marginLeft: "0" }}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <Input
                  background={"whitesmoke"}
                  border={"1px solid lightgray"}
                  type="text"
                  onChange={typingHandler}
                  value={newMessage}
                  marginTop={2}
                />
              </FormControl>
            )}
          </Box>
        </>
      ) : (
        <>
          <Box
            display={"flex"}
            height={"100%"}
            justifyContent={"center"}
            alignItems={"center"}>
            <Text fontSize={{ base: "27px", lg: "30px" }}>
              Select a User to start Chatting
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default SingleChat;
