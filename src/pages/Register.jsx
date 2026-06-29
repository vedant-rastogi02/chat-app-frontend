import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  HStack,
  Icon,
  Heading,
  Divider,
} from "@chakra-ui/react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUserPlus, FiShield, FiUsers } from "react-icons/fi";
import axios from "axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        email,
        password,
        username,
      });
      navigate("/login");
    } catch (error) {
      console.log("Login Error:", error);
      console.log("Response:", error.response);
      console.log("Data:", error.response?.data);

      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      w="100%"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="linear-gradient(180deg, #f5f8ff 0%, #e7effb 44%, #dce7f6 100%)"
      p={{ base: 3, md: 6 }}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-90px"
        left="-110px"
        w="260px"
        h="260px"
        bg="radial-gradient(circle, rgba(78,117,229,0.22) 0%, rgba(78,117,229,0) 70%)"
      />
      <Box
        position="absolute"
        bottom="-80px"
        right="-80px"
        w="240px"
        h="240px"
        bg="radial-gradient(circle, rgba(58,105,216,0.18) 0%, rgba(58,105,216,0) 70%)"
      />

      <Box
        display="flex"
        w="full"
        maxW="1200px"
        minH={{ base: "auto", md: "640px" }}
        borderRadius="36px"
        overflow="hidden"
        boxShadow="panel"
        border="1px solid"
        borderColor="rgba(255,255,255,0.75)"
        bg="rgba(255,255,255,0.5)"
        backdropFilter="blur(18px)"
        direction={{ base: "column", md: "row" }}
      >
        {/* Left Panel - Hidden on mobile */}
        <Box
          display={{ base: "none", md: "flex" }}
          w="50%"
          bg="linear-gradient(180deg, #2f6ce0 0%, #234a9a 100%)"
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="linear-gradient(180deg, rgba(49,92,190,0.12) 0%, rgba(12,22,51,0.5) 100%)"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            p={10}
            color="white"
          >
            <Heading fontSize="5xl" mb={4} lineHeight={1.05}>
              Join Our Chat Community
            </Heading>
            <Text
              fontSize="lg"
              maxW="420px"
              lineHeight={1.8}
              color="whiteAlpha.900"
            >
              Create your account and move into the same glossy, realtime
              workspace as your team.
            </Text>

            <HStack spacing={4} mt={10} align="flex-start">
              <Box
                bg="whiteAlpha.180"
                p={4}
                rounded="24px"
                border="1px solid rgba(255,255,255,0.22)"
              >
                <Icon as={FiShield} fontSize="24px" />
              </Box>
              <Box>
                <Text fontWeight="700">Secure onboarding</Text>
                <Text color="whiteAlpha.800" fontSize="sm">
                  Get started with a polished registration flow.
                </Text>
              </Box>
            </HStack>
            <HStack spacing={4} mt={4} align="flex-start">
              <Box
                bg="whiteAlpha.180"
                p={4}
                rounded="24px"
                border="1px solid rgba(255,255,255,0.22)"
              >
                <Icon as={FiUsers} fontSize="24px" />
              </Box>
              <Box>
                <Text fontWeight="700">Community rooms</Text>
                <Text color="whiteAlpha.800" fontSize="sm">
                  Create a profile and join conversations fast.
                </Text>
              </Box>
            </HStack>
          </Box>
        </Box>

        {/* Right Panel - Registration Form */}
        <Box
          w={{ base: "100%", md: "50%" }}
          bg="linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(243,247,253,0.96) 100%)"
          p={{ base: 6, md: 10 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {/* Mobile Header - Shown only on mobile */}
          <Box
            display={{ base: "block", md: "none" }}
            textAlign="center"
            mb={6}
          >
            <Box
              mx="auto"
              w={16}
              h={16}
              rounded="28px"
              bg="linear-gradient(180deg, #6f9cff 0%, #3569d8 100%)"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="button"
              mb={3}
            >
              <Icon as={FiUserPlus} fontSize="2rem" />
            </Box>
            <Heading size="lg" color="gray.800">
              Create Account
            </Heading>
          </Box>

          <VStack spacing={5} w="100%" maxW="420px" mx="auto" align="stretch">
            <Box>
              <Heading size="lg" color="gray.800">
                Start your WaveChat profile
              </Heading>
              <Text color="gray.600" mt={2} lineHeight={1.7}>
                Create a username, confirm your email, and step into the app
                with a tactile interface that feels premium.
              </Text>
            </Box>

            <FormControl id="username" isRequired>
              <FormLabel color="gray.700" fontWeight="medium">
                Username
              </FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                size="lg"
                bg="gray.50"
                borderColor="gray.200"
                _hover={{ borderColor: "indigo.500" }}
                _focus={{ borderColor: "indigo.500" }}
                placeholder="Choose a username"
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel color="gray.700" fontWeight="medium">
                Email
              </FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                size="lg"
                bg="gray.50"
                borderColor="gray.200"
                _hover={{ borderColor: "indigo.500" }}
                _focus={{ borderColor: "indigo.500" }}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel color="gray.700" fontWeight="medium">
                Password
              </FormLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                size="lg"
                bg="gray.50"
                borderColor="gray.200"
                _hover={{ borderColor: "indigo.500" }}
                _focus={{ borderColor: "indigo.500" }}
                placeholder="Create a password"
              />
            </FormControl>

            <Button
              onClick={handleSubmit}
              isLoading={loading}
              colorScheme="blue"
              bg="linear-gradient(180deg, #6f9cff 0%, #3569d8 100%)"
              width="100%"
              size="lg"
              fontSize="md"
              mt={4}
            >
              Create Account
            </Button>

            <Divider borderColor="surface.200" />

            <Text color="gray.600" pt={4}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--chakra-colors-indigo-600)",
                  fontWeight: "500",
                  transition: "color 0.2s",
                }}
                _hover={{ color: "indigo.700" }}
              >
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
