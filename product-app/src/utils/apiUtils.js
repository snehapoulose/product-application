export const checkApiResponse = async(response)=>{
    if (!response.ok) {
        const errorText = await response.text(); // Optional: fetch detailed error message
        throw new Error(
          `Request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      return response;
}