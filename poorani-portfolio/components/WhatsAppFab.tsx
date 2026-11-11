"use client";
import { motion } from "motion/react";
import { whatsappLink } from "@/lib/data";
import { WhatsAppIcon } from "./Icons";

/** Floating WhatsApp enquiry button shown on every page. */
export default function WhatsAppFab() {
  return (
    <aside aria-label="Quick enquiry">
    <motion.a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      data-cursor="Chat"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      className="group fixed z-[61] right-[max(16px,env(safe-area-inset-right,0px))] bottom-[calc(max(16px,env(safe-area-inset-bottom,0px))+72px)] md:bottom-[max(20px,env(safe-area-inset-bottom,0px))] flex items-center gap-2 rounded-full bg-[#25D366] text-ink h-14 pl-4 pr-4 md:pr-5 shadow-[0_16px_40px_-12px_rgba(0,0,0,.6)]"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 motion-reduce:hidden" aria-hidden="true" />
      <WhatsAppIcon className="relative w-6 h-6" />
      <span className="relative hidden md:inline font-semibold">Enquire</span>
    </motion.a>
    </aside>
  );
}
