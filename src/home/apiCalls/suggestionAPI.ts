export async function getTrending(params: any) {
    const { accessToken } = params;
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/suggestion/trending?limit=10`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Client-Type": "web",
    },
    credentials: "include",
  });

  return await res.json();
}
