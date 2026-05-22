type ChatAvatarColor = "moss" | "clay" | "ochre" | "slate";

type ChatMessageStatus = "normal" | "pending" | "failed" | "edited" | "readOnly";

type ChatMessageViewModel = {
  authorDisplayName: string;
  avatarColor?: ChatAvatarColor;
  avatarInitials?: string;
  body: string;
  id: string;
  linkedTurnLabel?: string;
  status: ChatMessageStatus;
  timestampLabel: string;
};

type SystemMessageType = "info" | "warning" | "process" | "stateChange";

type SystemMessageViewModel = {
  body: string;
  id: string;
  linkedObjectLabel?: string;
  timestampLabel: string;
  type: SystemMessageType;
};

export type {
  ChatAvatarColor,
  ChatMessageStatus,
  ChatMessageViewModel,
  SystemMessageType,
  SystemMessageViewModel
};
