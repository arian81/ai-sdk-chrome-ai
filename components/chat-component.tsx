"use client";
/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/PCj2KuvTC06
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormEvent, useState, KeyboardEvent } from "react";
import { CoreMessage, streamText } from "ai";
import { chromeai } from "chrome-ai";
import { MemoizedReactMarkdown } from "./markdown";
import { EmptyScreen } from "./empty-screen";
// import { Textarea } from "./ui/textarea";

export function ChatComponent({ error }: { error: any }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CoreMessage[]>([]);

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const newMessages: CoreMessage[] = [
      ...messages,
      { content: input, role: "user" },
    ];
    setInput("");
    setMessages(newMessages);

    try {
      const { textStream } = await streamText({
        model: chromeai("text", {}),
        // system: "Complete the conversation as if you were the model!",
        prompt: newMessages.slice(-1)[0].content as string,
      });
      for await (const textPart of textStream) {
        setMessages([...newMessages, { role: "assistant", content: textPart }]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((m, i) =>
            m.role === "user" ? (
              <UserMessage key={i} message={m} />
            ) : m.role === "assistant" ? (
              <BotMessage key={i} message={m} />
            ) : null
          )
        ) : (
          <div className="mx-auto text-center w-full max-w-md flex items-center justify-center h-full">
            <EmptyScreen />
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-background border-t border-muted px-4 py-3 sticky bottom-0 w-full"
      >
        <div className="relative">
          <Textarea
            placeholder="Type your message..."
            className="w-full rounded-lg pr-16 resize-none"
            disabled={error}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            minLength={8}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-3 -translate-y-1/2"
          >
            <SendIcon className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

const UserMessage = ({ message }: { message: CoreMessage }) => {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="bg-primary rounded-lg p-3 max-w-[80%] text-primary-foreground">
        {/* @ts-expect-error */}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>US</AvatarFallback>
      </Avatar>
    </div>
  );
};

const BotMessage = ({ message }: { message: CoreMessage }) => {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>BO</AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
        <p className="text-sm">
          <MemoizedReactMarkdown className={"prose"}>
            {/* @ts-expect-error */}
            {message.content}
          </MemoizedReactMarkdown>
        </p>
      </div>
    </div>
  );
};
