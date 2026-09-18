import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    {
      id: "email",
      type: "email",
      name: "Email",
      server: { host: "", port: 0, auth: { user: "", pass: "" } },
      from: process.env.MAILGUN_FROM_EMAIL,
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier: email, url, provider: { from } }) {
        const { host } = new URL(url);
        const res = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            from: from as string,
            to: email,
            subject: `Sign in to ${host}`,
            text: `Sign in to ${host}\n${url}\n\n`,
            html: `<body><p>Sign in to <strong>${host}</strong></p><p><a href="${url}">Click here to sign in</a></p></body>`,
          }),
        });
        if (!res.ok) {
          throw new Error("Mailgun error: " + await res.text());
        }
      },
    },
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/register",
    verifyRequest: "/register?verifyRequest=1",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
