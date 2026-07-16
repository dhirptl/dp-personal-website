"use client";

import { useTyping } from "@/lib/useTyping";

type CurrentlyTypingProps = {
  phrases: string[];
};

export function CurrentlyTyping({ phrases }: CurrentlyTypingProps) {
  const typed = useTyping(phrases, { type: 60, del: 30, pause: 2100 });
  return <>{typed}</>;
}
