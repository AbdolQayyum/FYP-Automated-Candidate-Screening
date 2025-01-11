export async function POST(req) {
  try {
    const { action, userInfo = {}, userResponse } = await req.json();

    if (!process.env.PYTHON_API_URL) {
      console.error("PYTHON_API_URL is not set in environment variables.");
      return new Response(JSON.stringify({ message: 'Internal Server Configuration Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let apiUrl = "";
    let bodyData = {};

    console.log('Received request body:', { action, userInfo, userResponse });

    if (action === "start") {
      if (!userInfo || !userInfo.candidate_id || !userInfo.candidate_name || !userInfo.job_title || !userInfo.experience || !userInfo.email) {
        console.error('Validation failed for userInfo:', userInfo);
        return new Response(JSON.stringify({ message: 'Incomplete user information' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      apiUrl = `${process.env.PYTHON_API_URL}/start`;
      bodyData = {
        candidate_id: userInfo.candidate_id,
        candidate_name: userInfo.candidate_name,
        email: userInfo.email,
        job_title: userInfo.job_title,
        experience: userInfo.experience,
      };

      console.log("Preparing to send data to FastAPI:", JSON.stringify(bodyData, null, 2));
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
      if (!userInfo || !userInfo.candidate_id) {
        console.error('Validation failed for get_feedback action:', userInfo);
        return new Response(JSON.stringify({ message: 'Candidate ID is required for feedback.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      apiUrl = `${process.env.PYTHON_API_URL}/get_feedback`;
      bodyData = {
        candidate_id: userInfo.candidate_id,
      };

      console.log("Fetching final feedback for candidate:", userInfo.candidate_id);
    } else {
      console.error("Invalid action:", action);
      return new Response(JSON.stringify({ message: 'Invalid action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sending request to FastAPI backend
    const fastApiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!fastApiResponse.ok) {
      const errorText = await fastApiResponse.text();
      console.error("Error from FastAPI:", errorText);
      throw new Error(`FastAPI Error: ${errorText || fastApiResponse.statusText}`);
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
