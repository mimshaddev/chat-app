export interface Participant {
  id: string;
  name: string;
  role: 0 | 1 | 2; // 0: admin, 1: agent, 2: customer
}

export interface Room {
  name: string;
  id: number;
  image_url: string;
  participant: Participant[];
}

export interface TextMessage {
  id: number;
  type: "text";
  message: string;
  sender: string;
  timestamp?: string;
}

export interface ImageMessage {
  id: number;
  type: "image";
  message: string;
  image_url: string;
  sender: string;
  timestamp?: string;
}

export interface VideoMessage {
  id: number;
  type: "video";
  message: string;
  video_url: string;
  thumbnail_url?: string;
  sender: string;
  timestamp?: string;
}

export interface PdfMessage {
  id: number;
  type: "pdf";
  message: string;
  pdf_url: string;
  file_name: string;
  file_size?: string;
  sender: string;
  timestamp?: string;
}

export interface AudioMessage {
  id: number;
  type: "audio";
  message: string;
  audio_url: string;
  sender: string;
  timestamp?: string;
}

export interface FileMessage {
  id: number;
  type: "file";
  message: string;
  file_url: string;
  file_name: string;
  file_size?: string;
  sender: string;
  timestamp?: string;
  mime_type?: string;
}

export type Message = TextMessage | ImageMessage | VideoMessage | PdfMessage | AudioMessage | FileMessage;

export interface ChatData {
  room: Room;
  comments: Message[];
}

export interface ChatResponse {
  results: ChatData[];
}

export const getRoleName = (role: number): string => {
  switch (role) {
    case 0:
      return "Admin";
    case 1:
      return "Agent";
    case 2:
      return "Customer";
    default:
      return "User";
  }
};

export const getRoleColor = (role: number): string => {
  switch (role) {
    case 0:
      return "chat-admin";
    case 1:
      return "chat-agent";
    case 2:
      return "chat-customer";
    default:
      return "primary";
  }
};
