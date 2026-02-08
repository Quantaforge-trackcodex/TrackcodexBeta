import axios from "axios";

async function testFlow() {
  const email = `test_${Date.now()}@example.com`;
  const password = "password123";
  const name = "Test User";
  const username = `user_${Date.now()}`;

  try {
    console.log(`\n1. Registering ${email}...`);
    const regRes = await axios.post(
      "http://localhost:4000/api/v1/auth/register",
      {
        email,
        password,
        name,
        username,
      },
    );
    console.log("Registration Success:", regRes.status);

    console.log(`\n2. Logging in...`);
    const loginRes = await axios.post(
      "http://localhost:4000/api/v1/auth/login",
      {
        email,
        password,
      },
    );
    console.log("Login Success:", loginRes.status);
  } catch (error: any) {
    console.error("FAILED");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

testFlow();
