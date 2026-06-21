import React from "react";

export default function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="35"
      height="24"
      viewBox="0 0 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Shopping bag handle */}
      <path
        d="M18 16 C18 7, 34 7, 34 16"
        stroke="#3b49df"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Blue bag body outline (left, bottom, top) */}
      <path
        d="M34 16 H18 V36 H34"
        stroke="#3b49df"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Green bag body outline (arrow/play button) */}
      <path
        d="M34 16 L46 26 L34 36"
        stroke="#10b981"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
