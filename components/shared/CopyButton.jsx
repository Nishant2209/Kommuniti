"use client";

import Image from "next/image";
import { useState } from "react";

const CopyButton = ({ id, type }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    if (type === "Thread") {
      navigator.clipboard.writeText(
        `https://kommuniti.vercel.app/thread/${id}`
      );
    } else if (type === "User") {
      navigator.clipboard.writeText(
        `https://kommuniti.vercel.app/profile/${id}`
      );
    }
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
        {isCopied && type === "Thread" && "Copied"}
      </p>
    </div>
  );
};

export default CopyButton;
