const BASE_URL = "https://puja-backend-beta.vercel.app/api/v1/admin";

interface LoginResponse {
  token: string;
  admin: {
    _id: string;
    name: string;
    email: string;
  };
}

interface SummaryResponse {
  totalReceived: number;
  totalExpenses: number;
  remaining: number;
}

interface Invoice {
  _id: string;
  name?: string;
  expence_name?: string;
  number: string;
  items: string[];
  amount: number;
  village: string;
  invoice_type: "donation" | "expence";
  createdAt: string;
  updatedAt: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invailed Email or Password");
  }

  return await response.json();
};

export const createDonation = async (
  token: string,
  data: {
    name: string;
    number: string;
    items: string[];
    amount: number;
    village: string;
  }
): Promise<Invoice> => {
  const response = await fetch(`${BASE_URL}/donation/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: `${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create donation");
  }

  const json = await response.json();
  return json.donation;
};

export const createExpense = async (
  token: string,
  data: {
    name: String;
    expence_name: string;
    number: string;
    items: string[];
    amount: number;
    village: string;
  }
): Promise<Invoice> => {
  const response = await fetch(`${BASE_URL}/expense/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: `${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create expense");
  }

  const json = await response.json();
  return json.expense;
};

export const updateInvoice = async (
  token: string,
  id: string,
  data: Partial<Omit<Invoice, "_id" | "createdAt" | "updatedAt">>
): Promise<Invoice> => {
  const response = await fetch(`${BASE_URL}/invoice/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: `${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update invoice");
  }

  const json = await response.json();
  return json.updated;
};

export const deleteInvoice = async (
  token: string,
  id: string
): Promise<{ message: string }> => {
  const response = await fetch(`${BASE_URL}/invoice/delete/${id}`, {
    method: "DELETE",
    headers: {
      token: `${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete invoice");
  }

  return await response.json();
};

export const getInvoices = async (options?: {
  page?: number;
  limit?: number;
  type?: "donation" | "expence";
  name?: string;
  full?: boolean;  // <-- Add this option
}): Promise<{
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  invoices: Invoice[];
}> => {
  const params = new URLSearchParams();

  if (options?.page) params.append("page", options.page.toString());
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.type) params.append("type", options.type);
  if (options?.name) params.append("name", options.name);
  if (options?.full) params.append("full", "true");  // <-- Append full if true

  const response = await fetch(`${BASE_URL}/invoices?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch invoices");
  }

  return await response.json();
};


export const fetchSummary = async (): Promise<SummaryResponse | null> => {
  try {
    const response = await fetch(`${BASE_URL}/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch summary");
    }

    const data: SummaryResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching summary:", error);
    return null;
  }
};
