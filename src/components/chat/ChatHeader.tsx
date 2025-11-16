import { Room } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getRoleName, getRoleColor } from "@/types/chat";
import { Users, PanelRightOpen, X as CloseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  room: Room;
  onToggleDetails?: () => void;
  showDetails?: boolean;
}

const ChatHeader = ({ room, onToggleDetails, showDetails }: ChatHeaderProps) => {
  return (
    <div className="border-b bg-card p-4 space-y-3">
      
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={room.image_url} alt={room.name} />
          <AvatarFallback>{room.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-lg text-foreground truncate">
            {room.name}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            {room.participant.length} participants
          </p>
        </div>
        {onToggleDetails && (
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={onToggleDetails}
          >
            {showDetails ? (
              <>
                <CloseIcon className="h-4 w-4 mr-2" />
                Tutup
              </>
            ) : (
              <div className="">
                <PanelRightOpen className="h-6 w-4" />
              </div>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
