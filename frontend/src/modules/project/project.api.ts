export type Project = {
  id: string;
  name: string;
  idea: string;
  createdAt: string;
  updatedAt: string;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

async function parseApiError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as {
      message?: string;
      error?: string;
    };

    return payload.message || payload.error || "Request failed";
  } catch {
    return "Request failed";
  }
}

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_BASE}/projects`);

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function createProject(
  name: string,
  idea: string,
): Promise<Project> {
  const response = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, idea }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}
