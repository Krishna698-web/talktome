import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  FormControl,
  Input,
  useToast,
  Box,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvide";
import axios from "axios";
import UserBadgeItem from "../UserListItems/UserBadgeItem";
import UserListItem from "../UserListItems/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [updatedGroupName, setUpdatedGroupName] = useState("");
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  async function handleRename() {
    if (!updatedGroupName) return;

    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: updatedGroupName,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
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

  async function handleSearch(query) {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${query}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setSearchResult(data);
      console.log(data);
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

  async function handleAddUser(userToBeAdded) {
    if (selectedChat.users.find((u) => u._id === userToBeAdded._id)) {
      toast({
        title: "User already exists!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (user._id !== selectedChat.groupAdmin._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToBeAdded._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log(data);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  }

  async function handleRemove(userToBeRemoved) {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToBeRemoved._id !== user._id
    ) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToBeRemoved._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      userToBeRemoved._id === user.id
        ? setSelectedChat()
        : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setUpdatedGroupName("");
  }
  return (
    <>
      <>
        <IconButton onClick={onOpen} icon={<ViewIcon />} />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box display={"flex"} flexWrap={"wrap"} gap={1} mb={2}>
                {selectedChat.users.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleRemove(user)}>
                    {user.name}
                  </UserBadgeItem>
                ))}
              </Box>
              <FormControl display={"flex"} gap={1} mb={3}>
                <Input
                  type="text"
                  placeholder="New name.."
                  onChange={(e) => setUpdatedGroupName(e.target.value)}
                />
                <Button
                  backgroundColor="#2f52a4"
                  color={"white"}
                  isLoading={renameLoading}
                  onClick={handleRename}>
                  Update
                </Button>
              </FormControl>
              <FormControl display={"flex"} gap={1}>
                <Input
                  type="text"
                  placeholder="Add user to group"
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                />
              </FormControl>
              {loading ? (
                <Spinner mt={2} />
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                backgroundColor="red"
                onClick={() => handleRemove(user)}
                color={"white"}
                p={"lg"}
                mt={-2}>
                Leave Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export default UpdateGroupChatModal;
