export type MessagePayload = {
  content: string,
  msg: string,
  username: string,
  auth_id: string,
  avatar: string,
  sender_socket_id: string,
  room: string
};



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
  room: string,
  auth_id: string,
  action: string,
}