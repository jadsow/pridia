export type PRDSummary = {
  id: string;
  createdAt: string;
  preview?: string;
};

export type PRD = {
  id: string;
  projectId: string;
  content: string;
  createdAt: string;
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

export async function getPRDsByProject(
  projectId: string,
): Promise<PRDSummary[]> {
  const response = await fetch(`${API_BASE}/projects/${projectId}/prds`);

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function getPRDById(
  projectId: string,
  prdId: string,
): Promise<PRD> {
  const response = await fetch(
    `${API_BASE}/projects/${projectId}/prds/${prdId}`,
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function generatePRD(projectId: string): Promise<PRD> {
  const response = await fetch(
    `${API_BASE}/projects/${projectId}/generate-prd`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}

export async function updatePRD(
  projectId: string,
  prdId: string,
  content: string,
): Promise<PRD> {
  const response = await fetch(
    `${API_BASE}/projects/${projectId}/prds/${prdId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return response.json();
}
