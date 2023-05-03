import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvide";
import axios from "axios";
import UserListItem from "../UserListItems/UserListItem";
import UserBadgeItem from "../UserListItems/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupChatName, setGroupChatName] = useState();

  const { chats, setChats, user } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  async function handleSubmit() {
    if (!groupChatName) {
      toast({
        title: "Field Error",
        description: "Set a name for the group",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }

    try {
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast({
        title: "Group Created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setChats([data, ...chats]);
      onClose();
    } catch (error) {
      toast({
        title: "Error occured",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  }
  async function handleSearch(query) {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  function handleGroup(userToAdd) {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "Error occured",
        description: "User already exits",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  function handleDelete(userId) {
    const filteredUser = selectedUsers.filter((user) => userId !== user._id);
    setSelectedUsers([...filteredUser]);
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={2} gap={1}>
              <Input
                type="text"
                placeholder="Group name"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Add users..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display={"flex"} gap={1} mt={2} flexWrap={"wrap"}>
              {selectedUsers.length > 0 &&
                selectedUsers.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user._id)}
                  />
                ))}
            </Box>
            {loading ? (
              <div style={{ textAlign: "center" }}>loading...</div>
            ) : (
              searchResult
                .slice(0, 5)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" color={"white"} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
