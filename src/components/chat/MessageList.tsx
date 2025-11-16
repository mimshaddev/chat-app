import { useLayoutEffect, useMemo, useRef } from "react";
import { Message, Participant } from "@/types/chat";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  participants: Participant[];
  currentUserId?: string;
}

const MessageList = ({ messages, participants, currentUserId = "agent@mail.com" }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const participantLookup = useMemo(
    () =>
      participants.reduce<Record<string, Participant>>((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {}),
    [participants]
  );

  const getParticipant = (senderId: string) =>
    participantLookup[senderId] ?? {
      id: senderId,
      name: "Unknown",
      role: 2 as const,
    };

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [messages]);

  return (
    <div className="space-y-1">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          participant={getParticipant(message.sender)}
          isOwn={message.sender === currentUserId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
