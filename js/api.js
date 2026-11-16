const BASE_URL = "http://localhost:3000";
export const request = async (method, route, body = null) => {
  const options = {
    method,
    headers: {},
  };
  if (body !== null) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(`${BASE_URL}${route}`, options);
    if (!response.ok) {
      const error = new Error(`Erreur HTTP : ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur API :", error);
    throw error;
  }
};

