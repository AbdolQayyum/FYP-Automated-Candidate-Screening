export async function POST(req) {
  try {
    const { action, userInfo, userResponse } = await req.json();

    if (!process.env.PYTHON_API_URL) {
      console.error("PYTHON_API_URL is not set in environment variables.");
      return new Response(JSON.stringify({ message: 'Internal Server Configuration Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let apiUrl = "";
    let bodyData = {};

    if (action === "start") {
      if (!userInfo || !userInfo.user_name || !userInfo.field || !userInfo.experience) {
        return new Response(JSON.stringify({ message: 'Incomplete user information' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      apiUrl = `${process.env.PYTHON_API_URL}/start`;
      bodyData = userInfo;
      console.log("Starting interview with user information:", JSON.stringify(userInfo, null, 2));
      
    } else if (action === "next_question") {
      if (!userResponse) {
        return new Response(JSON.stringify({ message: 'User response is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      apiUrl = `${process.env.PYTHON_API_URL}/next_question`;
      bodyData = { user_response: userResponse };
      console.log("Fetching next question with user response:", userResponse);

    } else if (action === "get_feedback") {
      apiUrl = `${process.env.PYTHON_API_URL}/get_feedback`;
      bodyData = {};
      console.log("Fetching final feedback after 20 questions.");
      
    } else {
      return new Response(JSON.stringify({ message: 'Invalid action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fastApiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!fastApiResponse.ok) {
      const errorResponse = await fastApiResponse.json();
      console.error("Error from FastAPI:", errorResponse);
      throw new Error(`FastAPI Error: ${errorResponse.detail || fastApiResponse.statusText}`);
    }

    const fastApiData = await fastApiResponse.json();
    console.log("Response from FastAPI:", fastApiData);

    return new Response(JSON.stringify(fastApiData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error processing request in Next.js API route:", error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
