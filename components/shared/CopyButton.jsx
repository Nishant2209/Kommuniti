"use client";

import Image from "next/image";
import { useState } from "react";

const CopyButton = ({ id }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(`https://kommuniti.vercel.app/thread/${id}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  return (
    <div className="flex flex-col justify-center items-start">
      <Image
        src="/assets/share.svg"
        alt="heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
        onClick={handleCopy}
      />
      <p className="text-tiny-medium text-gray-1">
        {isCopied ? "Copied" : null}
      </p>
    </div>
  );
};

export default CopyButton;
