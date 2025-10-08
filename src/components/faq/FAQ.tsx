import * as React from "react";
import { motion } from "motion/react";
import plusIcon from "../../assets/plus.png?url";
import minusSvg from "../../assets/mines.svg?url";

function Add({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <div 
      className="backdrop-blur-[7.5px] backdrop-filter bg-[#290079] box-border content-stretch flex gap-[10px] h-[80px] items-center justify-center px-[32px] py-[29px] relative rounded-br-[8px] rounded-tr-[8px] shrink-0 w-[86px] cursor-pointer hover:bg-[#1f005c] transition-colors" 
      data-name="Add"
      onClick={onClick}
    >
      {isOpen ? (
        <img
          src={minusSvg}
          alt="Collapse"
          style={{ width: "19.5735px", height: "2.64px" }}
          className="absolute top-[9px] left-1/2 -translate-x-1/2 opacity-100"
        />
      ) : (
        <img src={plusIcon} alt="Expand" className="h-[22px] w-[22px] opacity-100" />
      )}
    </div>
  );
}

interface FaqItemProps {
  number: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ number, question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div
      className={`backdrop-blur-[7.5px] backdrop-filter box-border content-stretch flex gap-[40px] items-start pl-[40px] pr-0 pt-0 relative rounded-[8px] shrink-0 transition-all duration-300`}
      style={{ paddingBottom: isOpen ? 32 : 0 }}
      data-name="faq"
    >
      <div aria-hidden="true" className="absolute border-2 border-[#152329] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-full">
        <div
          className="content-stretch flex gap-[40px] items-center relative shrink-0 cursor-pointer select-none"
          role="button"
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
        >
          <p className="font-['Arial:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-black text-nowrap whitespace-pre">{number}</p>
          <p className="font-['Arial:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-[575px]">{question}</p>
          <Add isOpen={isOpen} onClick={onToggle} />
        </div>
        {isOpen && (
          <div className="box-border content-stretch flex gap-[10px] items-start pb-0 pl-[67px] pr-[10px] pt-[20px] relative shrink-0 w-[728px] animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="font-['Arial:Regular',_sans-serif] h-auto leading-[36px] not-italic relative shrink-0 text-[20px] text-black w-[661px]">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const faqData = [
  {
    question: "What file formats are supported?",
    answer: "Currently, we support PDF files only. Our Docling parser is optimized to handle various PDF structures, including scanned documents, multi-column layouts, and complex formatting commonly found in RFP documents."
  },
  {
    question: "How accurate is the AI extraction?",
    answer: "Our AI-powered extraction system achieves over 95% accuracy on standard RFP documents. The system uses advanced LLMs trained specifically on RFP formats to ensure high precision in extracting Summary, PQ, TQ, BOQ, and Payment Terms sections."
  },
  {
    question: "Is my data secure and private?",
    answer: "Yes, we take data security seriously. All uploaded files are encrypted in transit and at rest. Your documents are processed securely and are automatically deleted from our servers after 24 hours. We never share your data with third parties."
  },
  {
    question: "How long does the processing take?",
    answer: "Processing time typically ranges from 30 seconds to 2 minutes, depending on the size and complexity of your RFP document. Most standard RFPs are processed in under 60 seconds."
  },
  {
    question: "What sections are extracted into the Excel file?",
    answer: "We extract five key sections: Summary (executive overview), PQ (Pre-Qualification criteria), TQ (Technical Qualification requirements), BOQ (Bill of Quantities), and Payment Terms. Each section is organized into a separate sheet in the Excel file for easy navigation and analysis."
  }
];

export default function FAQ({ openFaq, setOpenFaq, isLoaded }: { openFaq: number | null; setOpenFaq: (i: number | null) => void; isLoaded: boolean; }) {
  // Single-open behavior: exactly one open at any time; cannot close to none
  const [currentIndex, setCurrentIndex] = React.useState<number>(
    () => (typeof openFaq === 'number' ? openFaq : 0)
  );

  const openOnly = (index: number) => {
    setCurrentIndex(index);
    setOpenFaq?.(index);
  };

  return (
    <motion.div 
      className="absolute contents left-0 top-[2026px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
    >
      <div className="absolute bg-[#f6fafb] h-[788px] left-0 right-0 top-[2026px] w-full" />
      <div className="absolute content-stretch flex flex-col gap-[32px] items-start left-1/2 top-[2070px] translate-x-[-50%]" data-name="faq section">
        {faqData.map((faq, index) => (
          <FaqItem
            key={index}
            number={`0${index + 1}`}
            question={faq.question}
            answer={faq.answer}
            isOpen={currentIndex === index}
            onToggle={() => openOnly(index)}
          />
        ))}
      </div>
    </motion.div>
  );
}


