import { useEffect, useMemo, useState } from "react";
import { Search, File, Image as ImageIcon, ChevronDown, Bell, CheckCircle, ArrowLeft, AudioLines, PanelRightOpen, X as CloseIcon , FileVideo, FileVideo2 } from "lucide-react";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";
import { ChatResponse, Message, Participant, Room, getRoleName } from "@/types/chat";
import chatDataJson from "@/data/chat-data.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Chat {
    id: number;
    name: string;
    lastMessage: string;
    timestamp: string;
    avatar: string;
    active: boolean;
    roomData: Room;
}

const Index = () => {
  const [chatData, setChatData] = useState<ChatResponse | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const gradients = [
    "from-orange-400 to-orange-600",
    "from-blue-400 to-blue-600",
    "from-emerald-400 to-emerald-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-amber-400 to-amber-600",
  ];

  const gradientFor = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % gradients.length;
    return gradients[idx];
  };

  const storageKey = (roomId?: number) => `chat_messages_${roomId ?? "default"}`;

  const persistMessages = (roomId: number | undefined, data: Message[]) => {
    if (!roomId) return;
    const serialized = JSON.stringify(data);
    try {
      sessionStorage.setItem(storageKey(roomId), serialized);
    } catch (err) {
      console.warn("Unable to persist messages to sessionStorage", err);
    }
    try {
      document.cookie = `${storageKey(roomId)}=${encodeURIComponent(serialized)}; path=/;`;
    } catch (err) {
      console.warn("Unable to persist messages to cookie", err);
    }
  };

  const loadMessages = (roomId: number | undefined, fallback: Message[]) => {
    if (!roomId) return fallback;
    const key = storageKey(roomId);
    try {
      const fromSession = sessionStorage.getItem(key);
      if (fromSession) return JSON.parse(fromSession) as Message[];
    } catch (err) {
      console.warn("Failed parsing sessionStorage messages", err);
    }
    try {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const cookie = cookies.find((c) => c.startsWith(`${key}=`));
      if (cookie) {
        const [, value] = cookie.split("=");
        if (value) return JSON.parse(decodeURIComponent(value)) as Message[];
      }
    } catch (err) {
      console.warn("Failed parsing cookie messages", err);
    }
    return fallback;
  };
  
  const initialChats: Chat[] = (chatDataJson as ChatResponse).results.map((r, i) => ({
      id: i + 1,
      name: r.room.name,
      lastMessage: r.comments[r.comments.length - 1]?.message || "No messages yet",
      timestamp: "10:45 AM",
      avatar: r.room.image_url || `https://i.pravatar.cc/150?u=group${i}`,
      active: i === 0,
      roomData: r.room,
  }));

  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(initialChats[0]);
  const selectedRoomId = selectedChat?.roomData.id;
  const fileStats = useMemo(() => {
    const stats = { documents: 0, photos: 0, videos: 0, audio: 0 };

    messages.forEach((msg) => {
      if (msg.type === "pdf") stats.documents += 1;
      if (msg.type === "image") stats.photos += 1;
      if (msg.type === "video") stats.videos += 1;
      if (msg.type === "audio") stats.audio += 1;
    });

    return stats;
  }, [messages]);
  const totalFiles = fileStats.documents + fileStats.photos + fileStats.videos + fileStats.audio;
  const allLinks = useMemo(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links: string[] = [];
    messages.forEach((msg) => {
      if (typeof msg.message === 'string') {
        const found = msg.message.match(urlRegex);
        if (found) {
          links.push(...found);
        }
      }
    });
    return links;
  }, [messages]);

  useEffect(() => {
    const data = chatDataJson as ChatResponse;
    setChatData(data);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized || !chatData) return;
    if (!selectedRoomId) return;
    const roomData = chatData.results.find((r) => r.room.id === selectedRoomId);
    const incoming = roomData?.comments || [];
    const persisted = loadMessages(selectedRoomId, incoming);
    setMessages(persisted);
  }, [selectedRoomId, isInitialized, chatData]);

  const formatChatTimestamp = (timestamp?: string) =>
    new Date(timestamp ?? Date.now()).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSendMessage = (message: Message) => {
    setMessages((prev) => {
      const next = [...prev, message];
      persistMessages(selectedRoomId, next);
      return next;
    });

    if (!selectedChat) return;

    const formattedTimestamp = formatChatTimestamp(message.timestamp);

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, lastMessage: message.message, timestamp: formattedTimestamp }
          : chat
      )
    );

    setSelectedChat((prev) =>
      prev ? { ...prev, lastMessage: message.message, timestamp: formattedTimestamp } : prev
    );
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setChats(chats.map(c => ({ ...c, active: c.id === chat.id })));
    setShowDetails(false);
  };

  if (!chatData || !chatData.results[0]) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Loading chat...</h1>
        </div>
      </div>
    );
  }

  const currentUser = {
    name: "Mimshad Ode",
    avatar: "https://i.pravatar.cc/150?u=agent@mail.com",
    status: "available",
  };

  const LeftPanel = () => (
    <div className="flex flex-col w-full md:w-[24%] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{currentUser.name}</h2>
                <div className="flex items-center text-sm text-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Available
                  <ChevronDown className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input placeholder="Search chats..." className="pl-10 bg-gray-100 dark:bg-gray-800 border-none" />
          </div>

          <h3 className="font-semibold mb-2">Last chats</h3>
          <div className="flex flex-col space-y-2">
            {chats.map(chat => (
              <div key={chat.id} onClick={() => handleSelectChat(chat)} className={`flex items-center p-2 rounded-lg cursor-pointer ${chat.active ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{chat.name}</h4>
                    <p className="text-xs text-gray-500">{chat.timestamp}</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Other Chats */}
              <div className="flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">KJ</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-semibold text-foreground truncate">Kate Johnson</h5>
                    <span className="text-xs text-muted-foreground">11:15</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">I will send the document t...</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">TS</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-semibold text-foreground truncate">Tamara Shevchenko</h5>
                    <span className="text-xs text-muted-foreground">10:05</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">are you going to is busine...</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">JC</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-semibold text-foreground truncate">Joshua Clarkson</h5>
                    <span className="text-xs text-muted-foreground">11:09</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">I suggest to start. I have a...</p>
                </div>
              </div>
        </div>
    </div>
  );

  const MiddlePanel = () => selectedChat && (
    <div className="flex flex-col flex-1 h-full">
        {/* <div className="md:hidden p-2 border-b border-gray-200 dark:border-gray-800">
            <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)}>
                <ArrowLeft className="h-6 w-6" />
            </Button>
        </div> */}
        <ChatHeader
          room={selectedChat.roomData}
          onToggleDetails={() => setShowDetails((prev) => !prev)}
          showDetails={showDetails}
        />
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
          <MessageList 
            messages={messages} 
            participants={selectedChat.roomData.participant}
            currentUserId="agent@mail.com"
          />
        </div>
        <MessageInput onSendMessage={handleSendMessage} />
        <div
          className={cn(
            "lg:hidden fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-lg transition-transform duration-300 ease-in-out z-40",
            showDetails ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-4 overflow-y-auto h-full space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="font-medium"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedChat(null);
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Chat list
              </Button>
            </div>
            <RightPanelContent />
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => setShowDetails(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
    </div>
  );

  const RightPanelContent = () => (
    <>
      <div className="text-center mb-6">
        <Avatar className="h-20 w-20 mx-auto mb-2">
          <AvatarImage src={selectedChat?.roomData.image_url || `https://i.pravatar.cc/150?u=group1`} />
          <AvatarFallback>GC</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold text-xl">{selectedChat?.roomData.name}</h2>
        <p className="text-sm text-gray-500">{selectedChat?.roomData.participant.length} Members</p>
      </div>

      <Tabs defaultValue="files" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">All files</p>
                <p className="font-bold text-lg">{totalFiles}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500">All links</p>
                <p className="font-bold text-lg">{allLinks.length}</p>
            </div>
          </div>

          <div className="space-y-4">
              <h3 className="font-semibold">File type</h3>
              <div className="flex items-center">
                  <div className="w-2 h-8 bg-blue-500 rounded-full mr-3"></div>
                  <File className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                      <p className="font-semibold">Documents</p>
                      <p className="text-sm text-gray-500">{fileStats.documents} file{fileStats.documents === 1 ? "" : "s"}</p>
                  </div>
              </div>
                <div className="flex items-center">
                    <div className="w-2 h-8 bg-green-500 rounded-full mr-3"></div>
                    <ImageIcon className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                        <p className="font-semibold">Photos</p>
                        <p className="text-sm text-gray-500">{fileStats.photos} file{fileStats.photos === 1 ? "" : "s"}</p>
                    </div>
                </div>
              <div className="flex items-center">
                  <div className="w-2 h-8 bg-purple-500 rounded-full mr-3"></div>
                  <FileVideo2 className="h-5 w-5 text-purple-500 mr-3" />
                  <div>
                      <p className="font-semibold">Videos</p>
                      <p className="text-sm text-gray-500">{fileStats.videos} file{fileStats.videos === 1 ? "" : "s"}</p>
                  </div>
              </div>
              <div className="flex items-center">
                  <div className="w-2 h-8 bg-amber-500 rounded-full mr-3"></div>
                  <AudioLines className="h-5 w-5 text-amber-500 mr-3" />
                  <div>
                      <p className="font-semibold">Audio</p>
                      <p className="text-sm text-gray-500">{fileStats.audio} file{fileStats.audio === 1 ? "" : "s"}</p>
                  </div>
              </div>
          </div>
        </TabsContent>

        <TabsContent value="participants" className="flex-1">
          <div className="space-y-3">
            {selectedChat?.roomData.participant.map((person: Participant) => (
              <div key={person.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={cn("text-xs font-semibold text-white bg-gradient-to-br", gradientFor(person.id || person.name))}>
                    {person.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{person.name}</p>
                  <p className="text-sm text-muted-foreground">{getRoleName(person.role)}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const RightPanel = () => selectedChat && (
    <div className="hidden lg:flex lg:w-[24%] flex-col bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 p-6">
      <RightPanelContent />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="md:hidden w-full">
            {selectedChat ? <MiddlePanel /> : <LeftPanel />}
        </div>
        <div className="hidden md:flex w-full h-full">
            <LeftPanel />
            <MiddlePanel />
            <RightPanel />
        </div>
    </div>
  );
};

export default Index;
