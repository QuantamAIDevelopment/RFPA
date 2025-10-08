import * as React from "react";
import { motion } from "motion/react";
import imgDivExtensionsSlideshowImgContainer3RllO from "../../assets/bgfile.png";

interface Props {
  onUploadClick: () => void;
  isLoading: boolean;
  isUploaded: boolean;
  isPageLoaded: boolean;
  HeroSection: React.FC<{ onUploadClick: () => void; isLoading: boolean; isUploaded: boolean }>;
}

export default function FileUploadSection({ onUploadClick, isLoading, isUploaded, isPageLoaded, HeroSection }: Props) {
  return (
    <motion.div 
      className="absolute h-[640px] left-[calc(50%-2px)] overflow-clip rounded-[16px] top-[1025px] translate-x-[-50%] w-[1140px]" 
      data-name="div.ExtensionsSlideshow_imgContainer__3RllO"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: isPageLoaded ? 1 : 0, y: isPageLoaded ? 0 : 40 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
    >
      <div className="absolute inset-0 opacity-80 overflow-hidden pointer-events-none rounded-[16px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgDivExtensionsSlideshowImgContainer3RllO} />
      </div>
      <div className="absolute box-border content-stretch flex flex-col h-[328.694px] items-start left-[147px] pb-[1.695px] pt-[52.557px] px-[52.557px] rounded-[14.835px] top-[155.81px] w-[846px]" data-name="Container">
        <div aria-hidden="true" className="absolute border-[1.695px] border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[14.835px]" />
        <HeroSection onUploadClick={onUploadClick} isLoading={isLoading} isUploaded={isUploaded} />
      </div>
    </motion.div>
  );
}


