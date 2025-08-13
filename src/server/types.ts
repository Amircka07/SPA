export type User = {
  id: string;
  name: string;
  email: string;
  country: string;
  registeredAt: string;
};

export type UsersArgs = {
  name?: string | null;
  email?: string | null;
  country?: string[] | null;
  registeredFrom?: string | null;
  registeredTo?: string | null;
  offset?: number | null;
  limit?: number | null;
};
