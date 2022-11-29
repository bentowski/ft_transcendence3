export type MessagePayload = {
  content: string,
  msg: string,
  username: string,
  auth_id: string,
  avatar: string,
  sender_socket_id: string,
  room: string
};

export type HistoryType = {
  game_id: bigint,
  user_one: string,
  user_two: string,
  score_one: number,
  score_two: number,
  winner: string,
  looser: string,
  createdAt: Date,
  users: UserType[],
}

export type PartiesType = {
  id: number;
  login: string;
  p1: string;
  p2: string;
}

export type ChanType = {
  id: string,
  type: string,
  name: string,
  owner: string,
  admin: string[],
  topic: string,
  password: string,
  isActive: boolean,
  messages: MessagePayload[],
  chanUser: UserType[],
  banUser: UserType[];
};

export type UserType = {
  user_id: string,
  auth_id: string,
  username: string,
  avatar: string,
  game_won: number,
  game_lost: number,
  total_games: number,
  total_score: number,
  status: number,
  twoFASecret: string,
  isTwoFA: number,
  channelJoind: Array<ChanType>
  friends: string[],
  blocked: string[],
}

export type ErrorType = {
  statusCode: number,
  message: string,
}

export type PunishSocketType = {
  chan: ChanType,
  auth_id: string,
  status: boolean,
}

export type AuthType = {
  isTok: number,
}

export type AvatarType = {
  url: string,
  hash: number,
}

export type UsersChanMuteType = {
  user: UserType | undefined,
  isMute: boolean,
}

export type UsersChanBanType = {
  user: UserType | undefined,
  isBan: boolean,
}

export type ParamsImgType = {
  method: string,
  credentials: string,
  headers: HeadersInit,
  body: FormData,
}

