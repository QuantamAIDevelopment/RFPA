import * as React from "react";
import { motion } from "motion/react";
import allvyLogo from "../../assets/allvy_logo.png";

function Brand() {
  return (
    <div className="relative shrink-0">
      <img src={allvyLogo} alt="ALLVY Software Solutions" className="h-[40px] w-auto" />
    </div>
  );
}

export default function Footer({ isLoaded }: { isLoaded: boolean }) {
  return (
    <motion.div 
      className="absolute box-border content-stretch flex flex-col gap-[10px] items-start left-1/2 px-[118px] py-[64px] top-[2800px] translate-x-[-50%] w-[1440px]" 
      data-name="Footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
    >
      <div aria-hidden="true" className="absolute border-[1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none" />
      <Brand />
      <p className="font-['Arial:Regular',_sans-serif] leading-[20px] not-italic relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">© 2025 ALLVY Software Pvt Ltd. All rights reserved.</p>
      <div className="w-full flex justify-end">
        <p className="absolute font-['Arial:Regular',_sans-serif] leading-[24px] left-[538px]  not-italic text-[17px]  text-black top-[67.81px] ">Transforming RFP documents into structured data with AI-powered extraction.</p>
      </div>
    </motion.div>
  );
}