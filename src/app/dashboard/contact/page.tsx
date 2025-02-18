"use client"

import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="Contact Support" />
          
          <div className="p-4 lg:p-8">
            <div className="bg-[#121212] rounded-[1rem] p-6">
              <div className="px-5 py-5 mx-auto">
                <h1 className="text-2xl font-bold mb-6">Contact Support</h1>
                
                <div className="space-y-6 text-gray-300">
                  <p className="leading-relaxed">
                    If you need assistance or have any questions, please don't hesitate to reach out to our dedicated support team.
                    We are here to help you resolve any issues, provide guidance, or answer your queries to ensure you have the best experience possible.
                  </p>
                  
                  <p className="leading-relaxed">
                    You can contact us using the link below, and one of our representatives will be happy to assist you promptly:
                  </p>
                  
                  <div className="mt-8">
                    <a
                      href={process.env.NEXT_PUBLIC_WIDGET_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-medium transition-colors"
                    >
                      Contact Support
                    </a>
                  </div>

                  <div className="mt-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Support Hours</h2>
                    <p>24/7 Support Available</p>
                    <p>Average Response Time: 5-10 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}