import { GetSession } from "@/lib/session";
import { SessionValueType } from "@/types";

const Actions = {
  CREATE_RESET_PASSWORD_LINK: "create:reset:password:link", // action for creating a link, that link will be use to renew or reset the password of the farmer
  CREATE_AGRICULTURIST_LINK: "create:agriculturist:link", // action for creating a link where the agriculturist can sign up
  READ_LINK: "read:link", // action for reading all the value in the link table
  DELETE_LINK: "delete:link", // action for deleting link that was created by the admin or the agriculturist

  AUTHORIZATION_FARMER: "authorization:farmer", // action for authorization of farmer
  AUTHORIZATION_FARMER_LEADER: "authorization:farmer:leader", // action for authorization of farmer leader
  AUTHORIZATION_AGRI: "authorization:agri", // action for authorization of agri
  AUTHORIZATION_AGRI_ADMIN: "authorization:agri:admin", // action for authorization of agri admin

  // admin creation action
  CREATE_USER_AGRI: "create:user:agri", // action to create a user role agriculture

  // action that wants to create, read, and update their own info
  CREATE_USER: "create:user", // action for creating a user(farmer sign up)
  READ_USER: "read:user", // action for the user to read their OWN information
  UPDATE_USER: "update:user", // action for the user to update their OWN information

  // action for the farmer leader to access their farmer org member
  READ_FARMER_ORG_MEMBER_USER: "read:farmer:org:member:user", // action to view the FARMER org member user
  UPDATE_FARMER_ORG_MEMBER_USER: "update:farmer:org:member:user", // action to update the FARMER USER (e.g. Validated)
  DELETE_FARMER_ORG_MEMBER_USER: "delete:farmer:org:member:user", // action for the farmer leader if the user is not active

  // action for both farmer leader and agri to view the farmer profile
  READ_FARMER_PROFILE: "read:farmer:profile",

  // action that wants to access the farmers info
  READ_FARMER_USER: "read:farmer:user", // action to view the FARMER USER
  UPDATE_FARMER_USER: "update:farmer:user", // action to update the FARMER USER (e.g. block)
  DELETE_FARMER_USER: "delete:farmer:user", // action to delete the FARMER USER

  // actions that want to makes a their OWN report and read it
  CREATE_REPORT: "create:report", // action for farmer to create their own report
  READ_REPORT: "read:report", // action for farmer to view their OWN report

  //action for the farmer leader to view and update their member report
  READ_FARMER_MEMBER_REPORT: "read:farmer:member:report", // action to view the farmer member report
  UPDATE_FARMER_MEMBER_REPORT: "update:farmer:member:report", // action to update the farmer member report

  // action that wants to access the farmers report info
  READ_FARMER_REPORT: "read:farmer:report", // action to view the farmer's report
  UPDATE_FARMER_REPORT: "update:farmer:report", // action to update the farmer's report
  DELETE_FARMER_REPORT: "delete:farmer:report", // action to delete the farmer's report

  //action regarding the farmer report lists
  READ_FARMER_REPORT_LIST: "read:farmer:report:list", // action for reading the farmer report list
  DELETE_FARMER_REPORT_LIST: "delete:farmer:report:list", // action for deleting the farmer report list

  // actions that wants to mutate the orgaanization the user is in
  CREATE_ORG: "create:org", // action for creating an organization
  READ_ORG: "read:org", // action of the farmer to know who is the leader of the organization that he's/she's in
  READ_OWN_ORG_LIST: "read:own:org:list", // action for FARMER LEADER ONLY to read the organization member
  UPDATE_MY_ORG: "update:my:org", // action of the farmer if he/she wants to change his/her organization

  // actions to in regarding of organization lists
  READ_ORG_LIST: "read:org:list", // action to read all the organization list
  READ_ORG_MEMBER_LIST: "read:org:member:list", // action to read all the member inside an organization

  // actions for user farmer role crops
  CREATE_CROP: "create:crop", // action farmer when creating your own crop info
  READ_CROP: "read:crop", // action farmer when reading the crop
  UPDATE_CROP: "update:crop", // action farmer when updating the crop
  DELET_CROP: "delete:crop", // action farmer when deleting the crop

  // action for viewing the other farmer crop
  READ_FARMER_CROP: "read:farmer:crop", // action for reading the crop of farmer user
} as const;

const ROLE_ACTION_PERMISION: { [key: string]: string[] } = {
  admin: [
    Actions.AUTHORIZATION_AGRI,
    Actions.AUTHORIZATION_AGRI_ADMIN,
    Actions.CREATE_AGRICULTURIST_LINK,
    Actions.CREATE_RESET_PASSWORD_LINK,
    Actions.DELETE_LINK,
    Actions.DELETE_FARMER_USER,
    Actions.DELETE_FARMER_REPORT,
    Actions.DELETE_FARMER_REPORT_LIST,
    Actions.READ_FARMER_CROP,
    Actions.READ_FARMER_PROFILE,
    Actions.READ_FARMER_REPORT,
    Actions.READ_FARMER_REPORT_LIST,
    Actions.READ_FARMER_USER,
    Actions.READ_LINK,
    Actions.READ_ORG,
    Actions.READ_ORG_LIST,
    Actions.READ_ORG_MEMBER_LIST,
    Actions.READ_USER,
    Actions.UPDATE_FARMER_USER,
    Actions.UPDATE_FARMER_REPORT,
    Actions.UPDATE_USER,
  ],
  agriculturist: [
    Actions.AUTHORIZATION_AGRI,
    Actions.CREATE_RESET_PASSWORD_LINK,
    Actions.DELETE_LINK,
    Actions.DELETE_FARMER_USER,
    Actions.DELETE_FARMER_REPORT,
    Actions.DELETE_FARMER_REPORT_LIST,
    Actions.READ_FARMER_CROP,
    Actions.READ_FARMER_PROFILE,
    Actions.READ_FARMER_REPORT,
    Actions.READ_FARMER_REPORT_LIST,
    Actions.READ_FARMER_USER,
    Actions.READ_LINK,
    Actions.READ_ORG,
    Actions.READ_ORG_LIST,
    Actions.READ_ORG_MEMBER_LIST,
    Actions.READ_USER,
    Actions.UPDATE_FARMER_USER,
    Actions.UPDATE_FARMER_REPORT,
    Actions.UPDATE_USER,
  ],
  leader: [
    Actions.AUTHORIZATION_FARMER,
    Actions.AUTHORIZATION_FARMER_LEADER,
    Actions.CREATE_CROP,
    Actions.CREATE_ORG,
    Actions.CREATE_REPORT,
    Actions.DELET_CROP,
    Actions.DELETE_FARMER_ORG_MEMBER_USER,
    Actions.READ_CROP,
    Actions.READ_FARMER_CROP,
    Actions.READ_FARMER_MEMBER_REPORT,
    Actions.READ_FARMER_PROFILE,
    Actions.READ_FARMER_ORG_MEMBER_USER,
    Actions.READ_REPORT,
    Actions.READ_ORG,
    Actions.READ_OWN_ORG_LIST,
    Actions.READ_USER,
    Actions.UPDATE_CROP,
    Actions.UPDATE_FARMER_MEMBER_REPORT,
    Actions.UPDATE_FARMER_ORG_MEMBER_USER,
    Actions.UPDATE_MY_ORG,
    Actions.UPDATE_USER,
  ],
  farmer: [
    Actions.AUTHORIZATION_FARMER,
    Actions.CREATE_CROP,
    Actions.CREATE_ORG,
    Actions.CREATE_REPORT,
    Actions.DELET_CROP,
    Actions.READ_CROP,
    Actions.READ_REPORT,
    Actions.READ_ORG,
    Actions.READ_USER,
    Actions.UPDATE_CROP,
    Actions.UPDATE_MY_ORG,
    Actions.UPDATE_USER,
  ],
  newUser: [Actions.CREATE_CROP, Actions.CREATE_USER, Actions.READ_ORG],
};

/**
 * a function that protects the server action that validates if the user is logged in
 * and the if the user is allowed to execute that server action
 * @param action that you want to execute (e.g. create:user)
 * @throws if the current user is not logged in yet
 * and if the user role cant access the action that was passed in this function
 * @returns the userId of the current logged in user
 */
export const ProtectedAction = async (
  action: string
): Promise<SessionValueType> => {
  const session = await GetSession();

  if (!session) throw new Error("You need to log in first");

  if (!ROLE_ACTION_PERMISION[session.work].includes(action))
    throw new Error("You are not allowed to execute this action");

  return { userId: session.userId, work: session.work };
};
