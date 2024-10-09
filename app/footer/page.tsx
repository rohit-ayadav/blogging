export default function Footer() {
    return (
        // always footer at the bottom if page content is less and if page content is more then footer will be at the end of the page but when less it should at bottom
        <footer className="bg-gray-800 text-white text-center py-3">
            <p>&copy; 2021 Blogging. All rights reserved.</p>
        </footer>
    );
};