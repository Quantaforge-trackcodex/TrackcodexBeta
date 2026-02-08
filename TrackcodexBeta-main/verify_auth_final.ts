import axios from "axios";

async function verify() {
  try {
    const response = await axios.post(
      "http://127.0.0.1:4000/api/v1/auth/login",
      {
        email: "dev@trackcodex.dev",
        password: "password",
      },
    );
    console.log("STATUS:", response.status);
    console.log("BODY:", JSON.stringify(response.data));
    if (response.status === 200) {
      console.log("SUCCESS: Login works perfectly!");
      process.exit(0);
    }
  } catch (error: any) {
    if (error.response) {
      console.error(
        "FAILURE: Server responded with",
        error.response.status,
        error.response.data,
      );
    } else {
      console.error("ERROR:", error.message);
    }
    process.exit(1);
  }
}

verify();
