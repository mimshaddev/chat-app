import { Message, Participant, getRoleColor } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  participant: Participant;
  isOwn: boolean;
}

const MessageBubble = ({ message, participant, isOwn }: MessageBubbleProps) => {
  const roleColor = getRoleColor(participant.role);
  
  const truncateText = (text: string, max = 28) => {
    if (!text) return "";
    return text.length > max ? `${text.slice(0, max)}...` : text;
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case "text": {
        const renderTextWithLinks = (text: string) => {
          if (!text) return null;
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const parts = text.split(urlRegex);
          return parts.map((part, i) => {
            if (part.match(urlRegex)) {
              return (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all"
                >
                  {part}
                </a>
              );
            }
            return part;
          });
        };
        return (
          <div className="whitespace-pre-wrap break-words break-all">
            {renderTextWithLinks(message.message)}
          </div>
        );
      }
      
      case "image":
        return (
          <div className="space-y-2">
            {message.message && (
              <div className="whitespace-pre-wrap break-words break-all">
                {message.message}
              </div>
            )}
            <img
              src={message.image_url}
              alt="Shared image"
              className="rounded-lg max-w-full h-auto max-h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.image_url, "_blank")}
            />
          </div>
        );
      
      case "video":
        return (
          <div className="space-y-2">
            {message.message && (
              <div className="whitespace-pre-wrap break-words break-all">
                {message.message}
              </div>
            )}
            <video
              controls
              className="rounded-lg max-w-full h-auto max-h-80"
              poster={message.thumbnail_url}
            >
              <source src={message.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      
      case "pdf":
        return (
          <div className="space-y-2">
            {message.message && (
              <div className="whitespace-pre-wrap break-words break-all mb-2">
                {message.message}
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 border border-border">
              <div className="flex-shrink-0">
                <FileText className={cn("h-8 w-8", isOwn ? "text-white" : "text-destructive")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate max-w-[200px]" title={message.file_name}>
                  {truncateText(message.file_name)}
                </p>
                {message.file_size && (
                  <p className="text-xs text-muted-foreground">
                    {message.file_size}
                  </p>
                )}
              </div>
              <a
                href={message.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>
        );
      
      case "file":
        return (
          <div className="space-y-2">
            {message.message && (
              <div className="whitespace-pre-wrap break-words break-all mb-2">
                {message.message}
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 border border-border">
              <div className="flex-shrink-0">
                <FileText className={cn("h-8 w-8", isOwn ? "text-white" : "text-destructive")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate max-w-[200px]" title={message.file_name}>
                  {truncateText(message.file_name)}
                </p>
                {message.file_size && (
                  <p className="text-xs text-muted-foreground">
                    {message.file_size}
                  </p>
                )}
              </div>
              <a
                href={message.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>
        );
      
      case "audio":
        return (
          <div className="space-y-2">
            {message.message && (
              <div className="whitespace-pre-wrap break-words">
                {message.message}
              </div>
            )}
            <audio controls className="w-full">
              <source src={message.audio_url} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isOwn && "flex-row-reverse"
      )}
    >
      {isOwn ? (
        <div className="h-8 w-8 flex-shrink-0 hidden" />
      ) : (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className={`bg-${roleColor} text-${roleColor}-foreground text-xs font-medium text-white`}>
            {participant.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn("flex flex-col gap-1 max-w-[70%]", isOwn && "items-end")}>
        <div className="flex items-center gap-2 px-1">
          {!isOwn && (
            <span className="text-xs font-medium text-foreground">
              {participant.name}
            </span>
          )}
          {message.timestamp && (
            <span className="text-xs text-muted-foreground">
              {formatTime(message.timestamp)}
            </span>
          )}
        </div>
        
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm shadow-sm break-words break-all",
            isOwn
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-chat-bubble-other text-foreground rounded-tl-sm"
          )}
        >
          {renderMessageContent()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
