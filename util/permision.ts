const Actions = {
  // admin creation action
  CREATE_USER_ADMIN: "create:iser:admin",

  // user actions
  CREATE_USER: "create:user",
  READ_USER: "read:user",
  UPDATE_USER: "update:user",
  DELETE_USER: "delete:user",

  // report actions
  CREATE_REPORT: "create:report",
  READ_REPORT: "read:report",
  UPDATE_REPORT: "update:report",
  DELETE_REPORT: "delete:report",
} as const;

export const ROLE_ACTION_PERMISION: { [key: string]: string[] } = {
  admin: [
    Actions.CREATE_USER_ADMIN,
    Actions.DELETE_REPORT,
    Actions.DELETE_USER,
    Actions.READ_REPORT,
    Actions.READ_USER,
    Actions.UPDATE_USER,
  ],
  agriculturist: [],
  farmer: [],
};
