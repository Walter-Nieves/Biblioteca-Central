const API_URL = "http://localhost:3000/api";

export async function getData<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}/${endpoint}`);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || "Error en la petición");
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("❌ El backend devolvió HTML:", text);
    throw new Error("La API no devolvió JSON");
  }
}

export async function postData<T>(
  endpoint: string,
  data: object
): Promise<T> {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function putData<T>(
  endpoint: string,
  data: object
): Promise<T> {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteData(endpoint: string): Promise<void> {
  await fetch(`${API_URL}/${endpoint}`, { method: "DELETE" });
}


export async function patchData<T = void>(
  endpoint: string,
  body: unknown
): Promise<T> {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error en PATCH");
  }

  return res.status === 204 ? (undefined as T) : res.json();
}

