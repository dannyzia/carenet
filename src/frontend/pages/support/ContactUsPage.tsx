"use client";

import React from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Send, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  ChevronRight
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useNavigate } from "react-router";
import { cn } from "@/frontend/theme/tokens";
import { PageHero } from "@/frontend/components/PageHero";
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { supportService } from "@/backend/services/support.service";
import { PageSkeleton } from "@/frontend/components/PageSkeleton";
import { useTranslation } from "react-i18next";

export default function ContactUsPage() {
  const { t: tDocTitle } = useTranslation("common");
  useDocumentTitle(tDocTitle("pageTitles.contactUs", "Contact Us"));

  const navigate = useNavigate();
  const { data: contactInfo, loading } = useAsyncData(() => supportService.getContactInfo());

  if (loading || !contactInfo) return <PageSkeleton />;

  return (
    <div>
      {/* Header */}
      <PageHero gradient="radial-gradient(143.86% 887.35% at -10.97% -22.81%, #111827 0%, #000000 100%)" className="pt-20 pb-40 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-white text-center">
           <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">We're Here for You</h1>
           <p className="text-white/50 text-xl max-w-2xl mx-auto">Have questions about our care services? Our team is available 24/7 to provide assistance across Bangladesh.</p>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FEB4C5]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      </PageHero>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Contact Form */}
           <div className="lg:col-span-2">
              <div className="finance-card p-10 md:p-16">
                 <h2 className="text-3xl font-black text-gray-800 mb-8">Send us a Message</h2>
                 <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#FEB4C5]/20 outline-none font-bold text-gray-800" placeholder="John Doe" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                          <input className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-[#FEB4C5]/20 outline-none font-bold text-gray-800" placeholder="john@example.com" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                       <select className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-bold text-gray-800 appearance-none">
                          <option>General Inquiry</option>
                          <option>Caregiver Support</option>
                          <option>Booking & Payments</option>
                          <option>Partnership Request</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                       <textarea 
                          className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-[#FEB4C5]/20 transition-all min-h-[160px] text-sm text-gray-600 leading-relaxed" 
                          placeholder="How can we help you today?"
                       />
                    </div>
                    <Button className="w-full h-16 rounded-3xl bg-gray-900 hover:bg-black text-white font-black text-lg shadow-2xl transition-all group mt-4">
                       Send Message
                       <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                 </form>
              </div>
           </div>

           {/* Contact Details */}
           <div className="lg:col-span-1 space-y-8">
              <div className="finance-card p-10 space-y-10">
                 <div className="space-y-6">
                    <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">Reach Us Directly</h3>
                    <div className="space-y-6">
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#E8F9E7] flex items-center justify-center text-[#5FB865] flex-shrink-0"><Phone className="w-6 h-6" /></div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">24/7 Hotline</p>
                             <p className="text-sm font-black text-gray-800">+880 171XXXXXXX</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#FFF5F7] flex items-center justify-center text-[#DB869A] flex-shrink-0"><Mail className="w-6 h-6" /></div>
                          <div>
                             <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Email Support</p>
                             <p className="text-sm font-black text-gray-800">support@carenet.bd</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6 pt-10 border-t border-gray-50">
                    <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">Our Headquarters</h3>
                    <div className="flex gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0"><MapPin className="w-6 h-6" /></div>
                       <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Dhaka Office</p>
                          <p className="text-sm font-black text-gray-800 leading-relaxed">House 12, Road 5, Sector 4,<br />Uttara, Dhaka - 1230</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6 pt-10 border-t border-gray-50">
                    <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">Follow Us</h3>
                    <div className="flex gap-4">
                       {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                         <button key={i} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#FEB4C5] hover:text-white transition-all">
                            <Icon className="w-4 h-4" />
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="finance-card p-10 bg-[#7CE577] text-white relative overflow-hidden group cursor-pointer">
                 <h3 className="text-2xl font-black mb-2 relative z-10">Live Support</h3>
                 <p className="text-white/70 text-sm relative z-10">Chat with a medical coordinator right now.</p>
                 <div className="mt-8 flex items-center gap-2 font-black text-white relative z-10 group-hover:gap-4 transition-all">
                    Start Chat <ChevronRight className="w-6 h-6" />
                 </div>
                 <MessageCircle className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10 opacity-20" />
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "\n        .finance-card {\n          background: rgba(255, 255, 255, 0.95);\n          backdrop-filter: blur(10px);\n          border: 1px solid rgba(255, 255, 255, 0.4);\n          border-radius: 3.5rem;\n          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);\n        }\n      " }} />
    </div>
  );
}