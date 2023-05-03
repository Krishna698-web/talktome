import React, { useEffect, useState } from "react";
import { Box, Button, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvide";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../Miscellaneous/ChatLoading";
import { getSender } from "../../Config/ChatLogics";
import GroupChatModal from "../Modals/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setChats(data);
    } catch (error) {
      toast({
        title: "Field Error",
        description: "Failed to load chats",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "35%", lg: "25%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}>
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}>
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "15px", lg: "17px" }}
            rightIcon={<AddIcon boxSize={4} />}>
            New Groupt Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        width={"100%"}
        h={"80vh"}
        bg={"white"}>
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#8080ff" : "#e8e8e8"}
                color={selectedChat === chat ? "white" : "black"}
                p={2}
                borderRadius={"sm"}
                key={chat._id}>
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
