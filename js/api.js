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
export const getCreatures = async (params = {}) => {
  const searchParams = new URLSearchParams();
  if (params.type && params.type !== "all") {
    searchParams.append("type", params.type);
  }
  if (params.q && params.q.trim() !== "") {
    searchParams.append("q", params.q.trim());
  }
  const query = searchParams.toString();
  const route = query ? `/creatures?${query}` : "/creatures";
  return request("GET", route);
};
