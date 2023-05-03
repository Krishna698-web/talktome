import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <>
      <Box
        my={2}
        display="flex"
        backgroundColor="#e8e8e8"
        p="6px 8px"
        _hover={{ background: "#a8c0ff" }}
        cursor={"pointer"}
        borderRadius={"5px"}
        overflow={"hidden"}
        gap={2}
        onClick={handleFunction}>
        <Avatar src={user.pic} name={user.name} />
        <Box>
          <Text size={"m"} fontWeight={"500"}>
            {user.name}
          </Text>
          <Text fontSize={"xs"}>
            <b>Email:</b>&nbsp;
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default UserListItem;
