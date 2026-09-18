import { StudioChat } from "@/components/studio-chat";

export default function ChatPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <StudioChat userEmail="harshit@articulatex.in" />
    </div>
  );
}
