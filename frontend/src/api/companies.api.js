import client from "./client";

export const companiesApi = {
  getAll: () => client.get("/companies").then((r) => r.data),
};
