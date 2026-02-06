import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        otp: {}
      },
      async authorize(credentials) {
        const client = await connectDB();
        const db = client.db("skgh_db");

        const user = await db.collection("users").findOne({
          email: credentials.email
        });

        if (!user) return null;

        if (credentials.password !== user.password) return null;

        let mfaVerified = false;
        if (["DOCTOR", "ADMIN"].includes(user.role)) {
          if (credentials.otp !== user.otp) return null;
          mfaVerified = true;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          mfaVerified
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.mfaVerified = user.mfaVerified;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.mfaVerified = token.mfaVerified;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
