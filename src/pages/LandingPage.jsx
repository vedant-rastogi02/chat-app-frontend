import React, { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
  Link,
  useColorModeValue,
  SimpleGrid,
  Flex,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  FiMessageSquare,
  FiUsers,
  FiLock,
  FiLogIn,
  FiUserPlus,
  FiGlobe,
  FiActivity,
  FiUserCheck,
} from "react-icons/fi";

const Feature = ({ title, text, icon, badges = [] }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      rounded="2xl"
      p={6}
      spacing={4}
      border="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      boxShadow="soft"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "panel",
      }}
      transition="all 0.3s ease"
    >
      <Flex
        w={16}
        h={16}
        align="center"
        justify="center"
        color="white"
        rounded="2xl"
        bg={useColorModeValue("blue.500", "blue.400")}
      >
        {icon}
      </Flex>
      <Box>
        <HStack spacing={2} mb={2}>
          <Text fontWeight={600} fontSize="lg">
            {title}
          </Text>
          {badges.map((badge, index) => (
            <Badge
              key={index}
              colorScheme={badge.color}
              variant="subtle"
              rounded="full"
              px={2}
            >
              {badge.text}
            </Badge>
          ))}
        </HStack>
        <Text color={useColorModeValue("gray.500", "gray.200")}>{text}</Text>
      </Box>
    </Stack>
  );
};

const ChatMessage = ({ message, sender, time, isUser }) => {
  return (
    <Flex justify={isUser ? "flex-end" : "flex-start"} w="100%">
      <Box
        bg={isUser ? "blue.500" : "gray.100"}
        color={isUser ? "white" : "gray.800"}
        borderRadius="24px"
        px={4}
        py={2}
        maxW="80%"
        boxShadow="soft"
      >
        <Text fontSize="sm" fontWeight="bold" mb={1}>
          {sender}
        </Text>
        <Text>{message}</Text>
        <Text
          fontSize="xs"
          color={isUser ? "whiteAlpha.700" : "gray.500"}
          mt={1}
        >
          {time}
        </Text>
      </Box>
    </Flex>
  );
};

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (location && location.state && location.state.scrollTo) {
      const id = location.state.scrollTo;
      const el = document.getElementById(id);
      if (el) {
        // slight delay to ensure layout is ready
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
      }
      // clear navigation state so repeated visits don't re-scroll
      try {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.search,
        );
      } catch (e) {}
    }
  }, [location]);
  return (
    <Box
      bg="linear-gradient(180deg, #f6f9ff 0%, #e8f0fb 42%, #dce7f6 100%)"
      minH="100vh"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-120px"
        left="-120px"
        w="320px"
        h="320px"
        bg="radial-gradient(circle, rgba(105,147,238,0.22) 0%, rgba(105,147,238,0) 72%)"
      />
      <Box
        position="absolute"
        bottom="-80px"
        right="-100px"
        w="300px"
        h="300px"
        bg="radial-gradient(circle, rgba(67,108,216,0.18) 0%, rgba(67,108,216,0) 74%)"
      />

      {/* Hero Section */}
      <Container maxW="7xl" pt={10} position="relative" zIndex={1}>
        <Flex
          align="center"
          justify="space-between"
          mb={{ base: 8, md: 14 }}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <HStack spacing={3} align="center">
            <Flex
              w={10}
              h={10}
              align="center"
              justify="center"
              borderRadius="14px"
              bg="linear-gradient(180deg, #6f9cff 0%, #3569d8 100%)"
              boxShadow="button"
              color="white"
            >
              <Icon as={FiMessageSquare} fontSize="18px" />
            </Flex>
            <Box>
              <Text fontSize="lg" fontWeight="800" lineHeight={1}>
                WaveChat
              </Text>
              <Text fontSize="xs" color="gray.600">
                Realtime group conversations
              </Text>
            </Box>
          </HStack>

          <HStack
            spacing={{ base: 4, md: 8 }}
            fontSize="sm"
            fontWeight="600"
            color="gray.700"
            justify="center"
          >
            <Link as={RouterLink} to="/" state={{ scrollTo: "about" }}>
              About
            </Link>
            <Link as={RouterLink} to="/" state={{ scrollTo: "features" }}>
              Features
            </Link>
            <Link as={RouterLink} to="/login">
              Login
            </Link>
          </HStack>
        </Flex>

        <Stack
          id="about"
          align="center"
          spacing={{ base: 8, md: 10 }}
          py={{ base: 8, md: 14 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 8 }}>
            <Heading
              lineHeight={0.95}
              fontWeight={800}
              fontSize={{ base: "4xl", sm: "5xl", lg: "7xl" }}
              letterSpacing="-0.04em"
            >
              <Text
                as="span"
                position="relative"
                display="inline-block"
                px={2}
                py={1}
                rounded="md"
                bg="blue.300"
                color="gray.900"
              >
                WaveChat
              </Text>
              <br />
              <Text as="span" color="blue.400" fontFamily="Fraunces, serif">
                Chat App
              </Text>
            </Heading>
            <Text color="gray.500" fontSize="xl" maxW="2xl" lineHeight={1.8}>
              Experience seamless group communication with our modern chat
              platform. Connect with teams, friends, and communities in
              real-time with advanced features like typing indicators and online
              status.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: "column", sm: "row" }}
            >
              <Button
                as={RouterLink}
                to="/register"
                rounded="full"
                size="lg"
                fontWeight="normal"
                px={8}
                colorScheme="blue"
                bg="blue.400"
                _hover={{ bg: "blue.500" }}
                leftIcon={<FiUserPlus />}
              >
                Get Started
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                rounded="full"
                size="lg"
                fontWeight="normal"
                px={8}
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiLogIn />}
              >
                Sign In
              </Button>
            </Stack>
          </Stack>

          {/* Chat Preview */}
          <Flex
            flex={1}
            justify="center"
            align="center"
            position="relative"
            w="full"
          >
            <Box
              position="relative"
              height="500px"
              rounded="2xl"
              boxShadow="2xl"
              width="full"
              overflow="hidden"
              bg="white"
              border="1px"
              borderColor="gray.200"
            >
              {/* Chat Header */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bg="blue.500"
                p={4}
                color="white"
                borderBottom="1px"
                borderColor="blue.600"
              >
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiUsers} />
                    <Text fontWeight="bold">Team RealtimeX</Text>
                  </HStack>
                  <HStack spacing={4}>
                    <Badge colorScheme="green" variant="solid">
                      3 online
                    </Badge>
                    <Icon as={FiGlobe} />
                  </HStack>
                </HStack>
              </Box>

              {/* Chat Messages */}
              <VStack
                spacing={4}
                p={4}
                pt="60px"
                h="calc(100% - 120px)"
                overflowY="auto"
              >
                <ChatMessage
                  sender="Sarah Chen"
                  message="Hey team! Just pushed the new updates to staging."
                  time="10:30 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="Alex Thompson"
                  message="Great work! The new features look amazing 🚀"
                  time="10:31 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="You"
                  message="Thanks! Let's review it in our next standup."
                  time="10:32 AM"
                  isUser={true}
                />
                <Box w="100%" textAlign="center">
                  <Badge colorScheme="gray" fontSize="xs">
                    Sarah is typing...
                  </Badge>
                </Box>
              </VStack>
            </Box>
          </Flex>
        </Stack>

        {/* Features Grid */}
        <Box id="features" py={20}>
          <VStack spacing={2} textAlign="center" mb={12}>
            <Heading fontSize="4xl">Powerful Features</Heading>
            <Text fontSize="lg" color="gray.500">
              Everything you need for seamless team collaboration
            </Text>
          </VStack>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={10}
            px={{ base: 4, md: 8 }}
          >
            <Feature
              icon={<Icon as={FiLock} w={10} h={10} />}
              title="Secure Authentication"
              badges={[{ text: "Secure", color: "green" }]}
              text="Register and login securely with email verification and encrypted passwords."
            />
            <Feature
              icon={<Icon as={FiUsers} w={10} h={10} />}
              title="Group Management"
              badges={[{ text: "Real-time", color: "blue" }]}
              text="Create, join, or leave groups easily. Manage multiple conversations in one place."
            />
            <Feature
              icon={<Icon as={FiUserCheck} w={10} h={10} />}
              title="Online Presence"
              badges={[{ text: "Live", color: "green" }]}
              text="See who's currently online and active in your groups in real-time."
            />
            <Feature
              icon={<Icon as={FiActivity} w={10} h={10} />}
              title="Typing Indicators"
              badges={[{ text: "Interactive", color: "purple" }]}
              text="Know when others are typing with real-time typing indicators."
            />
            <Feature
              icon={<Icon as={FiMessageSquare} w={10} h={10} />}
              title="Instant Messaging"
              badges={[{ text: "Fast", color: "orange" }]}
              text="Send and receive messages instantly with real-time delivery and notifications."
            />
            <Feature
              icon={<Icon as={FiGlobe} w={10} h={10} />}
              title="Global Access"
              badges={[{ text: "24/7", color: "blue" }]}
              text="Access your chats from anywhere, anytime with persistent connections."
            />
          </SimpleGrid>
        </Box>

        {/* Call to Action */}
        <Box py={20}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={10}
            align="center"
            justify="center"
            bg={useColorModeValue("blue.50", "blue.900")}
            p={10}
            rounded="xl"
          >
            <VStack align="flex-start" spacing={4}>
              <Heading size="lg">Ready to get started?</Heading>
              <Text color="gray.600" fontSize="lg">
                Join thousands of users already using our platform
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              colorScheme="blue"
              rightIcon={<FiUserPlus />}
            >
              Create Free Account
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
