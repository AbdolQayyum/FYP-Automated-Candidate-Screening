// src/app/api/chatbot/interviewbot/route.js
export async function POST(request) {
    console.log("Received POST request at /api/chatbot/interviewbot"); // Initial log to confirm route hit

    try {
        // Parse the request body
        const body = await request.json();
        console.log("Parsed request body:", body); // Log the parsed request body
        
        // Log the URL being called in the FastAPI backend
        const apiUrl = `${process.env.PYTHON_API_URL}/start`;
        console.log("Calling FastAPI backend at:", apiUrl);

        // Make the request to the FastAPI backend
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        console.log("Received response from FastAPI with status:", response.status);

        // Parse the JSON data from FastAPI's response
        const data = await response.json();
        console.log("Data received from FastAPI:", data); // Log the actual response data

        // Return the response back to the frontend
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error in Next.js API route /api/chatbot/interviewbot:", error); // Log errors in catch block
        return new Response(JSON.stringify({ error: 'Error communicating with the chatbot API.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
