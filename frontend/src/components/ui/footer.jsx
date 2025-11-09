import React from "react";
import { 
  MapPin, 
  Phone, 
  Mail
} from 'lucide-react';
export default function Footer() {
    return <>
        {/* Footer */}
        <footer className="bg-gray-900 text-gray-200 w-full">
            <div className="py-12 w-full">
            <div className="max-w-screen-2xl mx-auto px-6 text-center">
                <h3 className="text-3xl font-bold">Be Prepared, Stay Safe</h3>
            </div>
            </div>

            <div className="bg-gray-800 py-12 w-full">
            <div className="max-w-screen-2xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* About Us */}
                <div>
                    <h4 className="text-xl font-semibold text-white mb-4">About Us</h4>
                    <p className="text-gray-400">
                    DisasterSafe is dedicated to providing real-time disaster
                    information and resources to help communities prepare for and
                    respond to emergencies effectively.
                    </p>
                </div>

                {/* Contact Us */}
                <div>
                    <h4 className="text-xl font-semibold text-white mb-4">Contact Us</h4>
                    <div className="space-y-2 text-gray-400">
                    <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        123 Safety Street, New Delhi, India
                    </p>
                    <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        support@disastersafe.org
                    </p>
                    <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        +91 1800-123-4567
                    </p>
                    </div>
                </div>

                {/* Emergency Hotlines */}
                <div>
                    <h4 className="text-xl font-semibold text-white mb-4">
                    Emergency Hotlines
                    </h4>
                    <div className="space-y-2 text-gray-400">
                    <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-red-500" />
                        <span className="font-semibold">National Emergency:</span> 112
                    </p>
                    <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-red-500" />
                        <span className="font-semibold">Disaster Helpline:</span> 1078
                    </p>
                    <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-red-500" />
                        <span className="font-semibold">Weather Alert:</span>{" "}
                        1800-180-1717
                    </p>
                    </div>
                </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500">
                <p>&copy; 2024 DisasterSafe. All rights reserved.</p>
                </div>
            </div>
            </div>
        </footer>
    </>;
}