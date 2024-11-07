// src/app/api/chatbot/interviewbot/route.js

export async function POST(req) {
    try {
      const userInfo = await req.json();
  
      // Validate received data
      if (!userInfo.user_name || !userInfo.field || !userInfo.experience) {
        return new Response(JSON.stringify({ message: 'Incomplete user information' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // Log the received data for debugging
      console.log("Received user information in Next.js:", JSON.stringify(userInfo, null, 2));
  
      // Check if PYTHON_API_URL is set in environment variables
      if (!process.env.PYTHON_API_URL) {
        console.error("PYTHON_API_URL is not set in environment variables.");
        return new Response(JSON.stringify({ message: 'Internal Server Configuration Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // Send the data to FastAPI
      const fastApiResponse = await fetch(`${process.env.PYTHON_API_URL}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
  
      if (!fastApiResponse.ok) {
        const errorResponse = await fastApiResponse.json();
        console.error("Error from FastAPI:", errorResponse);
        throw new Error(`FastAPI Error: ${errorResponse.detail || fastApiResponse.statusText}`);
      }
  
      const fastApiData = await fastApiResponse.json();
      console.log("Response from FastAPI:", fastApiData);
  
      // Respond back to the frontend with the FastAPI response
      return new Response(JSON.stringify({ message: fastApiData.message, conversation: fastApiData.conversation }), {
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
  