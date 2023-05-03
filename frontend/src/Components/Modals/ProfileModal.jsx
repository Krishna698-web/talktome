import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalContextProvider,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import ChatProvider from "../../Context/ChatProvide";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {!children ? (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      ) : (
        <span onClick={onOpen}>{children}</span>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"2rem"} textAlign={"center"}>
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            alignItems={"center"}
            flexDirection={"column"}>
            <Image
              src={user.pic}
              alt={user.name}
              h={"10rem"}
              w={"10rem"}
              borderRadius={"5rem"}
            />
            <ModalContextProvider />
            <Text fontSize={"1.5rem"}>Email: {user.email}</Text>
          </ModalBody>
          <ModalFooter>
            <Button backgroundColor="#2f52a4" color={"white"} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
