import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Flex,
  Icon,
  Avatar,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { FiSend, FiInfo, FiMessageCircle } from "react-icons/fi";
import UsersList from "./UsersList";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const ChatArea = ({ selectedGroup, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);

  const toast = useToast();

  const currentUser = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // fetch messages
  const fetchMessages = useCallback(async () => {
    const currentUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token = currentUser?.token;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/${selectedGroup._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [selectedGroup?._id]);

  useEffect(() => {
    if (selectedGroup && socket) {
      fetchMessages();
      socket.emit("join room", selectedGroup?._id);
      socket.on("message received", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      socket.on("users in room", (users) => {
        console.log("Received users:", users);
        setConnectedUsers(users);
      });
      socket.on("users joined", (users) => {
        setConnectedUsers((prev) => [...prev, ...users]);
      });

      socket.on("user left", (userId) => {
        setConnectedUsers((prev) =>
          prev.filter((user) => user?._id !== userId),
        );
      });

      socket.on("notification", (notification) => {
        toast({
          title:
            notification.type === "USER_JOINED" ? "New User" : "Notification",
          description: notification.message,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
      socket.on("user typing", (userId) => {
        setTypingUsers((prev) => new Set(prev).add(userId));
      });
      socket.on("user stop typing", (userId) => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });
      return () => {
        socket.emit("leave room", selectedGroup?._id);
        socket.off("message received");
        socket.off("users in room");
        socket.off("users joined");
        socket.off("user left");
        socket.off("notification");
        socket.off("user typing");
        socket.off("user stop typing");
      };
    }
  }, [selectedGroup, socket, toast, fetchMessages]);

  // send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const token = currentUser?.token;
      const data = await axios.post(
        "http://localhost:5000/api/messages",
        {
          content: newMessage,
          groupId: selectedGroup._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      socket.emit("new message", {
        ...data,
        groupId: selectedGroup._id,
      });
      setMessages((prev) => [...prev, data.data]);
      setNewMessage("");
    } catch {
      toast({
        title: "Error sending message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        groupId: selectedGroup._id,
        userId: currentUser.user.username,
      });
    }
    // clear exisiting timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (selectedGroup) {
        socket.emit("stop typing", {
          groupId: selectedGroup._id,
          userId: currentUser.user.username,
        });
        setIsTyping(false);
      }
    }, 2000);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderTypingIndicator = () => {
    if (typingUsers.size === 0) return null;
    const typingUsersArray = Array.from(typingUsers);
    return typingUsersArray.map((username) => (
      <Box
        key={username}
        alignSelf={
          username === currentUser?.user?.username ? "flex-end" : "flex-start"
        }
        maxW="70%"
      >
        <Flex
          align="center"
          bg={username === currentUser?.user?.username ? "blue.50" : "white"}
          p={2}
          borderRadius="lg"
          gap={2}
        >
          {/*current user(You) */}
          {username === currentUser?.user?.username ? (
            <>
              <Avatar size="xs" name={username} />
              <Flex align="center" gap={1}>
                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  You are typing
                </Text>
                <Flex gap={1}>
                  {[1, 2, 3].map((dot) => (
                    <Box
                      key={dot}
                      w={3}
                      h={3}
                      bg="gray.500"
                      borderRadius="full"
                    />
                  ))}
                </Flex>
              </Flex>
            </>
          ) : (
            <>
              <Flex align="center" gap={1}>
                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  {username} is typing
                </Text>
                <Flex gap={1}>
                  {[1, 2, 3].map((dot) => (
                    <Box
                      key={dot}
                      w={3}
                      h={3}
                      bg="gray.500"
                      borderRadius="full"
                    />
                  ))}
                </Flex>
              </Flex>
              <Avatar size="xs" name={username} />
            </>
          )}
        </Flex>
      </Box>
    ));
  };

  return (
    <Flex
      h="full"
      minH="100%"
      position="relative"
      direction={{ base: "column", xl: "row" }}
    >
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        bg="linear-gradient(180deg, rgba(250,252,255,0.96) 0%, rgba(240,245,251,0.98) 100%)"
        minW={0}
      >
        {selectedGroup ? (
          <>
            {/* Chat Header */}
            <Flex
              px={{ base: 4, md: 6 }}
              py={4}
              bg="linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(244,248,253,0.98) 100%)"
              borderBottom="1px solid"
              borderColor="surface.200"
              align="center"
              boxShadow="insetPanel"
            >
              <Icon
                as={FiMessageCircle}
                fontSize="24px"
                color="blue.500"
                mr={3}
              />
              <Box flex="1">
                <Text fontSize="lg" fontWeight="700" color="gray.800">
                  {selectedGroup?.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {selectedGroup?.description || "No description available"}
                </Text>
              </Box>
              <Icon
                as={FiInfo}
                fontSize="20px"
                color="gray.400"
                cursor="pointer"
                _hover={{ color: "blue.500" }}
              />
            </Flex>

            {/* Messages Area */}
            <VStack
              flex="1"
              overflowY="auto"
              spacing={4}
              align="stretch"
              px={{ base: 4, md: 6 }}
              py={4}
              position="relative"
              minH={0}
              sx={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  width: "10px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "gray.200",
                  borderRadius: "24px",
                },
              }}
            >
              {messages.map((message) => {
                const isCurrent =
                  message.sender._id === currentUser?.user?._id ||
                  message.sender.username === currentUser?.user?.username;
                return (
                  <Box
                    key={message._id}
                    alignSelf={isCurrent ? "flex-end" : "flex-start"}
                    maxW="70%"
                  >
                    <Flex
                      direction="column"
                      gap={1}
                      alignItems={isCurrent ? "flex-end" : "flex-start"}
                    >
                      <Flex
                        align="center"
                        mb={1}
                        justifyContent={isCurrent ? "flex-end" : "flex-start"}
                        gap={2}
                      >
                        {!isCurrent ? (
                          <>
                            <Text fontSize="xs" color="gray.500">
                              {message.sender.username} •{" "}
                              {formatTime(message.createdAt)}
                            </Text>
                            <Avatar size="xs" name={message.sender.username} />
                          </>
                        ) : (
                          <>
                            <Avatar size="xs" name={message.sender.username} />
                            <Text fontSize="xs" color="gray.500">
                              You • {formatTime(message.createdAt)}
                            </Text>
                          </>
                        )}
                      </Flex>

                      <Box
                        bg={
                          isCurrent
                            ? "linear-gradient(180deg, #5c8ff1 0%, #386dd9 100%)"
                            : "white"
                        }
                        color={isCurrent ? "white" : "gray.800"}
                        p={3}
                        borderRadius="22px"
                        boxShadow="soft"
                        borderWidth={isCurrent ? "0" : "1px"}
                        borderColor="surface.200"
                        textAlign={isCurrent ? "right" : "left"}
                      >
                        <Text>{message.content}</Text>
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
              {renderTypingIndicator()}
            </VStack>

            {/* Message Input */}
            <Box
              p={4}
              bg="linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(240,245,251,0.98) 100%)"
              borderTop="1px solid"
              borderColor="surface.200"
              position="relative"
              zIndex="1"
            >
              <InputGroup size="lg">
                <Input
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type your message..."
                  pr="4.5rem"
                  bg="surface.50"
                  border="1px solid"
                  borderColor="surface.200"
                  borderRadius="999px"
                  _focus={{
                    boxShadow:
                      "0 0 0 3px rgba(79, 148, 244, 0.16), inset 0 1px 2px rgba(15, 23, 42, 0.08)",
                    bg: "white",
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    colorScheme="blue"
                    bg="linear-gradient(180deg, #6da0ff 0%, #386dd9 100%)"
                    onClick={sendMessage}
                    borderRadius="full"
                    _hover={{
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s"
                  >
                    <Icon as={FiSend} />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Box>
          </>
        ) : (
          <Flex
            height="100%"
            direction="column"
            align="center"
            justify="center"
            p={8}
            textAlign="center"
            bg="linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(239,245,252,0.9) 100%)"
          >
            <Icon
              as={FiMessageCircle}
              fontSize="64px"
              color="gray.300"
              mb={4}
            />
            <Text fontSize="xl" fontWeight="medium" color="gray.500" mb={2}>
              Welcome to the chat
            </Text>
            <Text color="gray.500" mb={2}>
              Select a group from the sidebar to start chatting.
            </Text>
          </Flex>
        )}
      </Box>

      {/* UsersList with fixed width */}
      <Box
        width={{ base: "100%", xl: "260px" }}
        position="sticky"
        right={0}
        top={0}
        height="100%"
        flexShrink={0}
        display={{ base: "none", xl: "block" }}
      >
        {selectedGroup && <UsersList users={connectedUsers} />}
      </Box>
    </Flex>
  );
};

export default ChatArea;
