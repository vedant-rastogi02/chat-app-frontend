import {
  Box,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Icon,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiLogOut, FiPlus, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = ({ setSelectedGroup }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newGroupName, setNewGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const toast = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    fetchGroups();
  }, []);

  const checkAdminStatus = () => {
    try {
      const storedUser = localStorage.getItem("userInfo");

      if (!storedUser) {
        setIsAdmin(false);
        return;
      }

      const userInfo = JSON.parse(storedUser);

      setIsAdmin(userInfo?.user?.isAdmin ?? false);
    } catch (error) {
      console.error("Error parsing userInfo:", error);
      localStorage.removeItem("userInfo");
      setIsAdmin(false);
    }
  };
  //fetch all groups
  const fetchGroups = async () => {
    try {
      const storedUser = localStorage.getItem("userInfo");

      if (!storedUser) return;

      const userInfo = JSON.parse(storedUser);
      const token = userInfo?.token;

      const { data } = await axios.get("http://localhost:5000/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGroups(data);

      const loggedInUserId = userInfo.user.id;

      const userGroupIds = data
        .filter((group) =>
          group.members.some(
            (member) => member._id.toString() === loggedInUserId.toString(),
          ),
        )
        .map((group) => group._id);

      setUserGroups(userGroupIds);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };
  // create groups
  const handleCreateGroup = async () => {
    try {
      const storedUser = localStorage.getItem("userInfo");

      if (!storedUser) return;

      const userInfo = JSON.parse(storedUser);
      const token = userInfo?.token;
      await axios.post(
        "http://localhost:5000/api/groups",
        {
          name: newGroupName,
          description: newGroupDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast({
        title: "Group created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchGroups();
      setNewGroupName("");
      setNewGroupDescription("");
    } catch (error) {
      toast({
        title: "Error Creating Group",
        status: "error",
        duration: 3000,
        isClosable: true,
        description: error?.response?.data?.message || "An error occurred",
      });
    }
  };
  // join group
  const handleJoinGroup = async (groupId) => {
    try {
      const storedUser = localStorage.getItem("userInfo");

      if (!storedUser) return;

      const userInfo = JSON.parse(storedUser);
      const token = userInfo?.token;

      await axios.post(
        `http://localhost:5000/api/groups/${groupId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await fetchGroups();
      setSelectedGroup(groups.find((group) => group._id === groupId));
      toast({
        title: "Joined group successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error Joining Group",
        status: "error",
        duration: 3000,
        isClosable: true,
        description: error?.response?.data?.message || "An error occurred",
      });
    }
  };

  //leave group
  const handleLeaveGroup = async (groupId) => {
    try {
      const storedUser = localStorage.getItem("userInfo");

      if (!storedUser) return;

      const userInfo = JSON.parse(storedUser);
      const token = userInfo?.token;

      await axios.post(
        `http://localhost:5000/api/groups/${groupId}/leave `,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await fetchGroups();
      setSelectedGroup(null);
      toast({
        title: "Left group successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error Joining Group",
        status: "error",
        duration: 3000,
        isClosable: true,
        description: error?.response?.data?.message || "An error occurred",
      });
    }
  };
  // logout function
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <Box
      h="full"
      minH={{ base: "40vh", lg: "100%" }}
      bg="linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(238,244,250,0.94) 100%)"
      borderRight="1px solid"
      borderColor="rgba(255,255,255,0.7)"
      width="full"
      display="flex"
      flexDirection="column"
      boxShadow="insetPanel"
    >
      <Flex
        p={{ base: 4, md: 5 }}
        borderBottom="1px solid"
        borderColor="surface.200"
        bg="linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(240,245,252,0.96) 100%)"
        position="sticky"
        top={0}
        zIndex={1}
        backdropFilter="blur(14px)"
        align="center"
        justify="space-between"
      >
        <Flex align="center">
          <Flex
            align="center"
            justify="center"
            w={10}
            h={10}
            mr={3}
            borderRadius="16px"
            bg="linear-gradient(180deg, #5b8ef1 0%, #356ad8 100%)"
            boxShadow="0 10px 18px rgba(53, 106, 216, 0.25), inset 0 1px 0 rgba(255,255,255,0.4)"
          >
            <Icon as={FiUsers} fontSize="20px" color="white" />
          </Flex>
          <Box>
            <Text fontSize="lg" fontWeight="700" color="gray.800">
              Groups
            </Text>
            <Text fontSize="xs" color="gray.500">
              Join a room or create a new one
            </Text>
          </Box>
        </Flex>
        {isAdmin && (
          <Tooltip label="Create New Group" placement="right">
            <Button
              size="sm"
              colorScheme="blue"
              bg="linear-gradient(180deg, #74a7ff 0%, #4d82eb 100%)"
              color="white"
              variant="solid"
              onClick={onOpen}
              borderRadius="full"
              px={4}
            >
              <Icon as={FiPlus} fontSize="20px" />
            </Button>
          </Tooltip>
        )}
      </Flex>

      <Box flex="1" overflowY="auto" p={{ base: 4, md: 5 }} pb={24}>
        <VStack spacing={4} align="stretch">
          {groups.map((group) => {
            const joined = userGroups.includes(group._id);

            return (
              <Box
                key={group._id}
                p={4}
                cursor="pointer"
                borderRadius="24px"
                bg={
                  joined
                    ? "linear-gradient(180deg, #f4f9ff 0%, #e4eefc 100%)"
                    : "linear-gradient(180deg, #fbfdff 0%, #edf3fa 100%)"
                }
                borderWidth="1px"
                borderColor={joined ? "blue.200" : "surface.200"}
                transition="all 0.2s"
                boxShadow="soft"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "panel",
                  borderColor: "blue.300",
                }}
              >
                <Flex justify="space-between" align="center" gap={3}>
                  <Box
                    flex="1"
                    onClick={() => joined && setSelectedGroup(group)}
                  >
                    <Flex align="center" mb={2}>
                      <Text fontWeight="700" color="gray.800" noOfLines={1}>
                        {group.name}
                      </Text>

                      {joined && (
                        <Badge
                          ml={2}
                          colorScheme="blue"
                          variant="subtle"
                          borderRadius="full"
                          px={2}
                        >
                          Joined
                        </Badge>
                      )}
                    </Flex>

                    <Text
                      fontSize="sm"
                      color="gray.600"
                      noOfLines={2}
                      lineHeight={1.55}
                    >
                      {group.description}
                    </Text>
                  </Box>

                  <Button
                    size="sm"
                    colorScheme={joined ? "red" : "blue"}
                    variant={joined ? "outline" : "solid"}
                    onClick={() => {
                      userGroups.includes(group._id)
                        ? handleLeaveGroup(group?._id)
                        : handleJoinGroup(group?._id);
                    }}
                    _hover={{
                      transform: "scale(1.05)",
                      bg: joined ? "red.50" : "blue.600",
                    }}
                    transition="all 0.2s"
                  >
                    {joined ? "Leave" : "Join"}
                  </Button>
                </Flex>
              </Box>
            );
          })}
        </VStack>
      </Box>

      <Box
        p={4}
        borderTop="1px solid"
        borderColor="surface.200"
        bg="linear-gradient(180deg, rgba(243,247,253,0.92) 0%, rgba(230,238,248,0.98) 100%)"
        position="sticky"
        bottom={0}
        left={0}
        right={0}
        width="100%"
      >
        <Button
          onClick={handleLogout}
          variant="outline"
          colorScheme="red"
          leftIcon={<Icon as={FiLogOut} />}
          width="full"
          bg="whiteAlpha.700"
          _hover={{
            bg: "red.50",
            transform: "translateY(-2px)",
            shadow: "md",
          }}
          transition="all 0.2s"
        >
          Logout
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Group Name</FormLabel>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                focusBorderColor="blue.400"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Enter group description"
                focusBorderColor="blue.400"
              />
            </FormControl>

            <Button
              colorScheme="blue"
              mr={3}
              mt={4}
              width="full"
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Sidebar;
