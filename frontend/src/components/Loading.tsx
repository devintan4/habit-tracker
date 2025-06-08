import React from "react";

export default function Loading() {
  return (
    <div className="w-full flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
