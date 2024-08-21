import axios from "axios";

export const executeJSCode = async (sourceCode) => {
  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: "js",
        version: "18.15.0",
        files: [
          {
            content: sourceCode,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error executing code:", error);
    throw error;
  }
};

export const executeJavaCode = async (sourceCode) => {
  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: "java",
        version: "15.0.2",
        files: [
          {
            name: "Main.java",
            content: sourceCode,
          },
        ],
        main : "Main"
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error executing code:", error);
    throw error;
  }
};

export const executePythonCode = async (sourceCode) => {
  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: "python",
        version: "3.10.0",
        files: [
          {
            name : "main.py",
            content: sourceCode,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error executing code:", error);
    throw error;
  }
};
