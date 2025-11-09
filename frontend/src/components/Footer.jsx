// components/Footer.jsx

export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} MirrorLog. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-500 mt-2 md:mt-0">
                        Track your progress, visualize your growth.
                    </p>
                </div>
            </div>
        </footer>
    );
}
