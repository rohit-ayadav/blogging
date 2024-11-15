declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      image: string;
      role: string;
      address: string;
      id: string;
    };
  }
}
