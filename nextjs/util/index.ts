export const getToken = async () => {
  const req = await fetch("/api/get-token");
  const { access_token }: { access_token: string } = await req.json();
  return access_token;
};
