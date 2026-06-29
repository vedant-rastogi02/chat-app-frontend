import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
import { useState, useEffect } from "react";

const Chat = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

    const newSocket = io(ENDPOINT, {
      auth: {
        user: userInfo.user,
      },
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <Flex
      minH="100dvh"
      direction={{ base: "column", lg: "row" }}
      gap={{ base: 3, lg: 4 }}
      p={{ base: 3, md: 4 }}
      bg="transparent"
    >
      <Box
        w={{ base: "100%", lg: "320px" }}
        flexShrink={0}
        borderRadius="32px"
        overflow="hidden"
        bg="rgba(255, 255, 255, 0.74)"
        backdropFilter="blur(18px)"
        boxShadow="panel"
      >
        <Sidebar setSelectedGroup={setSelectedGroup} />
      </Box>

      <Box
        flex="1"
        minW={0}
        borderRadius="32px"
        overflow="hidden"
        bg="rgba(255, 255, 255, 0.74)"
        backdropFilter="blur(18px)"
        boxShadow="panel"
      >
        <ChatArea selectedGroup={selectedGroup} socket={socket} />
      </Box>
    </Flex>
  );
};

export default Chat;
