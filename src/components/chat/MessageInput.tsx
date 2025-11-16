import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Image, FileText, Video, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Message } from "@/types/chat";

interface MessageInputProps {
  onSendMessage: (message: Message) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<{
    type: "image" | "video" | "pdf" | "file";
    file: File;
    url: string;
  } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!(message.trim() || attachment)) return;

    const payload: Message = {
      id: Date.now(),
      type: attachment ? attachment.type : "text",
      message: message.trim() || `Sent a ${attachment?.type}`,
      sender: "agent@mail.com",
      timestamp: new Date().toISOString(),
      ...(attachment?.type === "image" && { image_url: attachment.url }),
      ...(attachment?.type === "video" && { video_url: attachment.url }),
      ...(attachment?.type === "pdf" && {
        pdf_url: attachment.url,
        file_name: attachment.file.name,
        file_size: `${(attachment.file.size / 1024).toFixed(2)} KB`,
      }),
      ...(attachment?.type === "file" && {
        file_url: attachment.url,
        file_name: attachment.file.name,
        file_size: `${(attachment.file.size / 1024).toFixed(2)} KB`,
        mime_type: attachment.file.type,
      }),
    } as Message;

    onSendMessage(payload);
    setMessage("");
    setAttachment(null);
  };

  const handleFileSelect = (type: "image" | "video" | "pdf" | "file", file: File) => {
    const url = URL.createObjectURL(file);
    setAttachment({ type, file, url });
  };

  const removeAttachment = () => {
    if (attachment) {
      URL.revokeObjectURL(attachment.url);
      setAttachment(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-card p-4">
      {attachment && (
        <div className="mb-2 p-2 bg-muted rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            {attachment.type === "image" && <Image className="h-4 w-4" />}
            {attachment.type === "video" && <Video className="h-4 w-4" />}
            {attachment.type === "pdf" && <FileText className="h-4 w-4" />}
            <span className="text-sm truncate max-w-[200px]">{attachment.file.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={removeAttachment}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex gap-2 items-end">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect("image", file);
          }}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect("video", file);
          }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="*/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const mime = file.type;
            if (mime.startsWith("image/")) {
              handleFileSelect("image", file);
            } else if (mime.startsWith("video/")) {
              handleFileSelect("video", file);
            } else if (mime === "application/pdf") {
              handleFileSelect("pdf", file);
            } else {
              handleFileSelect("file", file);
            }
          }}
        />
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="flex-shrink-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => imageInputRef.current?.click()}
              >
                <Image className="h-4 w-4 mr-2" />
                Image
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => videoInputRef.current?.click()}
              >
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="h-4 w-4 mr-2" />
                File
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
        />

        <Button
          onClick={handleSend}
          type="button"
          size="icon"
          className="flex-shrink-0"
          disabled={!message.trim() && !attachment}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 px-1">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};

export default MessageInput;
