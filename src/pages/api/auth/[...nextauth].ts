import NextAuth from "next-auth";
import Providers from "next-auth/providers";
// JWT (Storage)
// Next Auth (Social)
// Cognito-aws, Auth0

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "read:user",
    }),
    //...add more providers here
  ],

  //a database is optional, but required to persist accounts in a database
  //database: process.env.DATABASE_URL,
});
