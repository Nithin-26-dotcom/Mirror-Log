import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Logger from "../components/Logger";
import Roadmap from "../components/Roadmap";
import Sidebar from "../components/Sidebar";
import { PageProvider } from "../context/PageContext";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <PageProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-900 text-gray-200 font-sans selection:bg-indigo-500/30 selection:text-white">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 flex justify-center overflow-hidden">
          <div className="w-full max-w-7xl px-4 lg:px-6 py-5 flex flex-col">
            <div className="flex flex-1 gap-4 lg:gap-6 h-[calc(100vh-10rem)] transition-all">

              {/* Sidebar */}
              <motion.div
                animate={{ width: sidebarOpen ? 256 : 64 }} // 64px = 4rem collapsed
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full"
              >
                <Sidebar />
              </motion.div>

              {/* Main Panels (Logger + Roadmap) */}
              <motion.div
                key={sidebarOpen ? "expanded" : "collapsed"}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 ${sidebarOpen ? "pl-0" : "pl-1"
                  }`}
              >
                <div className="rounded-2xl">
                  <Logger />
                </div>
                <div className="rounded-2xl">
                  <Roadmap />
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </PageProvider>
  );
}
