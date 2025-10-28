// api-config/normalizeAxiosError.js
export function normalizeAxiosError(err) {
  const status = err.response?.status;
  const data = err.response?.data;
  const code = err.code;

  const message =
    (typeof data === "string" && data) ||
    data?.errors?.[0]?.message ||
    data?.message ||
    data?.error ||
    err.message ||
    "Something went wrong";

  const e = new Error(message);
  Object.assign(e, {
    name: "AxiosHttpError",
    status,
    code,
    data, // keep raw server payload for UI
    cause: err, // original AxiosError
    isAxiosHttpError: true,
  });

  return e; // ✅ IMPORTANT
}
