"use client";

import Lottie from "lottie-react";
import notFound from "@/assets/animation/notFound.json";
import empty from "@/assets/animation/empty.json";
import error from "@/assets/animation/error.json";

const lottieFilesmap = {
  notFound,
  empty,
  error,
};

interface LottieHandlerProps {
  type: keyof typeof lottieFilesmap;
  message?: string;
}

const LottieHandler = ({ type, message }: LottieHandlerProps) => {
  const lottie = lottieFilesmap[type];
  return (
    <div className="mx-auto text-center w-full max-w-md">
      <Lottie animationData={lottie} />
      {message && (
        <h3
          className={`mt-5 text-lg font-medium 
        ${type === "error" ? "text-red-600" : "text-gray-700"} 
        break-words whitespace-pre-wrap `}
          style={{ wordBreak: "break-word" }}
        >
          {message}
        </h3>
      )}
    </div>
  );
};

export default LottieHandler;
