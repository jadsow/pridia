const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

type DiscoveryAnswerResponse = {
  id: string;
  projectId: string;
  question: string;
  answer: string;
  createdAt: string;
};

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

export async function createDiscoveryAnswer(
  projectId: string,
  question: string,
  answer: string,
): Promise<DiscoveryAnswerResponse> {
  const response = await fetch(
    `${API_BASE}/projects/${projectId}/discovery`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}
