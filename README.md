# Blog Website

Welcome to the Blog Website! This platform allows users to read, create, and share blogs across various topics. The website is built with **Next.js** and includes features like user authentication, blog creation, and a rich-text editor for seamless writing experiences.

## Features

1. **User Authentication**:
   - Sign up and log in using email/password or Google account (via OAuth).
   - Secure authentication with session management using NextAuth.js.
2. **Blog Creation**:

   - Users can create, edit, and delete their blogs.
   - The "Create Blog" page includes a rich text editor with formatting options (bold, italic, headings, etc.).
   - Users can also upload cover images for their blogs.

3. **Dynamic Blog Display**:

   - Blogs are displayed dynamically with individual pages for each blog post.
   - Blog lists are paginated for easy navigation.

4. **Responsive Design**:

   - The website is fully responsive and works across all devices (mobile, tablet, desktop).

5. **SEO Optimized**:
   - Blog posts are SEO-friendly, helping them rank better on search engines.

## Tech Stack

- **Full Stack**: Next.js (both frontend and backend)
- **Authentication**: NextAuth.js for handling OAuth and email/password login
- **Database**: MongoDB (for storing users and blog data)
- **Styling**: Tailwind CSS
- **Rich Text Editor**: Slate.js

## Live Website

Check out the live website here: [Blog Website](https://www.food.devblogger.in/)

## Installation and Setup

1. Clone the repository:
   Clone the repository

2. Install dependencies:

Open the folder

```
   npm install
```

3. Set up environment variables:

   Create a `.env.local` file in the root directory and add the following variables:

   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXTAUTH_URL=http://localhost:3000
   MONGODB_URI=your-mongodb-connection-string
   ```

4. Run the development server:

   ```
   npm run dev
   ```

   The app will run on `http://localhost:3000`.

## Usage

- Users can browse blogs without an account.
- To create, edit, or delete blogs, users must sign up or log in.
- After logging in, go to the "Create Blog" page to start writing.
- Once published, blogs will be visible on the homepage and searchable by title.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or new features!

## License

This project is not licensed under the MIT License.

## Contact

If you have any questions or suggestions, feel free to reach out!
