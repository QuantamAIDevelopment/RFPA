import * as React from "react";
import { motion } from "motion/react";
import allvyLogo from "../../assets/allvy_logo.png";

function BrandLarge() {
  return (
    <div className="relative shrink-0">
      <img src={allvyLogo} alt="ALLVY Software Solutions" className="h-[50px] w-auto" />
    </div>
  );
}

export default function Nav({ isLoaded }: { isLoaded: boolean }) {
  return (
    <motion.div 
      className="absolute box-border content-stretch flex flex-col items-center left-1/2 top-[33px] -translate-x-1/2" 
      data-name="Nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <BrandLarge />
    </motion.div>
  );
}


