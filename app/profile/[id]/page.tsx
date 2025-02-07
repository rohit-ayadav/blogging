import { ErrorMessage } from "@/app/blogs/[id]/ErrorMessage";
import { notFound } from "next/navigation";
import AuthorPage from "./component/Profile";

export default async function IndividualProfile({ params }: { params: { id: string } }) {

    const response = await getPostData(params.id);

    if (!response || !response.success) {
        switch (response.statusCode) {
            case 404:
                notFound(); // This will render the 404 page
            case 403:
                return <ErrorMessage message="You don't have permission to view this blog post" />;
            case 401:
                return <ErrorMessage message="Please login to view this blog post" />;
            default:
                return <ErrorMessage message={response.error || 'Failed to load blog post'} />;
        }
    }

    return <AuthorPage postData={response.data} />;
}