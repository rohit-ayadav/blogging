import NextAuth from 'next-auth'
import GitHub from '@auth/core/providers/github'
import Google from 'next-auth/providers/google'


const handler = NextAuth({
    providers: [

        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })

    ]
})

export { handler as POST, handler as GET }

