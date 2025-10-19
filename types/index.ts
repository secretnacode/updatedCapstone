import {
  addFarmerReportSchema,
  authLogInSchema,
  authSignUpSchema,
  farmerSecondDetailFormSchema,
  userProfileInfoUpdateSchema,
  userProfileOrgUpdateSchema,
} from "@/util/helper_function/validation/validationSchema";
import { MapProps, MapRef } from "@vis.gl/react-maplibre";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Polygon,
} from "geojson";
import { LucideIcon } from "lucide-react";
import { MapMouseEvent } from "maplibre-gl";
import {
  ButtonHTMLAttributes,
  ChangeEvent,
  Dispatch,
  FormEvent,
  ReactNode,
  Ref,
  SetStateAction,
  TextareaHTMLAttributes,
} from "react";
import z from "zod/v4";

// exporting the type of authSignUpSchema so it can be used as a type together with the schema
export type AuthSignUpType = z.infer<typeof authSignUpSchema>;

// exporting the type of authSignUpSchema so it can be used as a type together with the schema
export type AuthLoginType = z.infer<typeof authLogInSchema>;

type NotificationStateType = "success" | "error" | "warning" | null;

export type AllHasValueType = {
  valid: boolean;
  message?: string;
};

export interface NotificationBaseType {
  message: string;
  type: NotificationStateType;
}

export type NotificationValType = NotificationBaseType & {
  notifId: string | null;
};

export type NotificationContextType = {
  notificationVal: NotificationValType[];
  handleRemoveNotification: (notifId: string) => void;
  handleSetNotification: (data: NotificationBaseType[]) => void;
};

export type ValidateReturnType = NotificationBaseType;

export type NewUserType = AuthLoginType & {
  userId: string;
  role: string;
};

export type ValidateAuthValType<T> =
  | {
      valid: false;
      errors: T;
    }
  | { valid: true };

export type QueryUserLoginReturnType =
  | {
      exist: false;
      message: string;
    }
  | {
      exist: true;
      data: { authId: string; password: string; work: string };
    };

export type AuthResponseType = {
  success: false;
  errors: NotificationBaseType[];
};

export type ErrorResponseType = {
  errors: NotificationBaseType[];
};

export type SessionValueType = {
  userId: string;
  work: allUserRoleType;
};

export type LoadingContextType = {
  isLoading: boolean;
  loadingMessage: string;
  handleIsLoading: (message: string) => void;
  handleDoneLoading: () => void;
};

export type QueryAvailableOrgReturnType = {
  orgId: string;
  orgName: string;
};

export type AvailableOrgReturnType =
  | {
      success: true;
      orgList: QueryAvailableOrgReturnType[];
    }
  | ServerActionFailBaseType;

export type FarmerFirstDetailFormType = {
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName: string | null;
  alias: string | null;
  mobileNumber: string;
  birthdate: Date;
  farmerBarangay: barangayType | string;
  countFamilyMember: string;
  organization: string;
  newOrganization: string | null;
};

export type FormActionBaseType<T> = {
  success: boolean | null;
  notifError: NotificationBaseType[] | null;
  formError: { [v in keyof T]?: string[] } | null;
};

export type FarmerFirstDetailActionReturnType<T> =
  | { success: true }
  | (ServerActionFailBaseType & { formError?: FormErrorType<T> });

export type FarmerFirstDetailType = {
  farmerId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName: string | null;
  alias: string | null;
  mobileNumber: number;
  farmerBarangay: string;
  birthdate: Date;
  verified: boolean;
  isDeleted: boolean;
  dateCreated: Date;
  countFamilyMember: number;
};

export type FarmerSecondDetailFormType = z.infer<
  typeof farmerSecondDetailFormSchema
>;

export type EditCropListType =
  | {
      editing: false;
      cropId: null;
    }
  | {
      editing: true;
      cropId: string;
    };

export type CropFormErrorsType = {
  cropId: string;
  formError: FormErrorType<FarmerSecondDetailFormType>;
};

export type CheckCropListReturnType =
  | {
      showModal: boolean;
      valid: false;
      formError: FormErrorType<FarmerSecondDetailFormType>;
      notifError?: NotificationBaseType[];
      isExistName?: boolean;
    }
  | { valid: true };

export type FarmerSecondDetailActionReturnType = ServerActionFailBaseType & {
  formList?: CropFormErrorsType[];
};

export type FirstErrorType = {
  organization: string;
  otherOrg: string;
  cropFarmArea: string;
  farmAreaMeasurement: string;
  cropBaranggay: string;
  cropId: string;
};

export type HandleInsertCropType = {
  userId: string;
  cropId: string;
  cropName: string;
  cropBaranggay: string;
  cropCoor: {
    lng: number;
    lat: number;
  };
  farmArea: string;
};

export type NavbarType =
  | {
      page: string;
      pageLabel: string;
      logo: LucideIcon;
    }[];

export type GetUserReportReturnType =
  | {
      reportId: string;
      cropName: string;
      verificationStatus: string;
      dayReported: string;
      dayHappen: string;
      title: string;
    }[];

export type ServerActionFailBaseType = {
  success: false;
  notifError: NotificationBaseType[];
};

export type GetFarmerReportReturnType =
  | {
      success: true;
      userReport: GetUserReportReturnType;
    }
  | ServerActionFailBaseType;

export type AddReportValType = z.infer<typeof addFarmerReportSchema>;

export type AddReportActionFormType = FormActionBaseType<AddReportValType>;

export type AddReportPictureType = {
  picId: string;
  file: File;
}[];

export type AddNewFarmerReportQueryType = {
  reportId: string;
  cropId: string;
  orgId: string;
  farmerId: string;
  reportTitle: string;
  reportDescription: string;
  dayHappen: Date;
  dayReported: string;
  verificationStatus: verificationStatusType;
  isSeenByAgri: boolean;
};

export type AddNewFarmerReportImageType = {
  picId: string;
  reportId: string;
  pictureUrl: string;
};

type GetFarmerReportDetailBaseType = {
  cropName: string;
  verificationStatus: verificationStatusType;
  dayReported: Date;
  dayHappen: Date;
  title: string;
  description: string;
  cropLat: number;
  cropLng: number;
  cropLocation: barangayType;
};

export type GetFarmerReportDetailQueryReturnType =
  GetFarmerReportDetailBaseType & {
    pictures: string;
  };

export type ReportDetailType = GetFarmerReportDetailBaseType & {
  pictures: string[];
};

export type GetFarmerReportDetailReturnType =
  | {
      success: true;
      reportDetail: ReportDetailType;
      work: allUserRoleType;
    }
  | ServerActionFailBaseType;

export type GetOrgMemberReportQueryType = {
  reportId: string;
  verificationStatus: string;
  dayReported: Date;
  title: string;
  farmerFirstName: string;
  farmerLastName: string;
  farmerAlias: string;
}[];

export type GetOrgMemberReportReturnType =
  | {
      success: true;
      memberReport: GetOrgMemberReportQueryType;
    }
  | ServerActionFailBaseType;

export type GetAllFarmerReportQueryReturnType = {
  reportId: string;
  cropLocation: string;
  verificationStatus: string;
  farmerName: string;
  dayReported: Date;
  dayHappen: Date;
  orgName: string;
}[];

export type GetAllFarmerReportReturnType =
  | {
      success: true;
      validatedReport: GetAllFarmerReportQueryReturnType;
    }
  | ServerActionFailBaseType;

export type GetFarmerOrgMemberQueryReturnType = {
  farmerId: string;
  farmerName: string;
  farmerAlias: string;
  mobileNumber: string;
  barangay: string;
  verified: boolean;
  cropNum: number;
}[];

export type GetFarmerOrgMemberReturnType =
  | {
      success: true;
      farmerMember: GetFarmerOrgMemberQueryReturnType;
    }
  | ServerActionFailBaseType;

export type GetFarmerProfilePersonalInfoQueryReturnType = {
  farmerId: string;
  farmerFirstName: string;
  farmerAlias?: string;
  mobileNumber: string;
  barangay: string;
  birthdate: Date;
  verified: boolean;
  farmerLastName: string;
  farmerMiddleName: string;
  farmerExtensionName?: string;
  familyMemberCount: string;
};

export type getFarmerCropNameQueryReturnType = {
  cropId: string;
  cropName: string;
};

export type GetFarmerProfileOrgInfoQueryReturnType = {
  orgId: string;
  orgRole: string;
  orgName: string;
  farmerLeader: string;
};

export type UserFarmerInfoPropType = {
  farmerFirstName: string;
  farmerLastName: string;
  farmerAlias: string;
  mobileNumber: string;
  barangay: string;
  birthdate: Date;
  orgId: string;
  orgRole: string;
  leaderName: string;
};

export type ViewUserProfileFormPropType = {
  userInfo: GetFarmerProfilePersonalInfoQueryReturnType;
};

export type MyProfileFormPropType = ViewUserProfileFormPropType;
// & (
//   | {
//       isViewing: true;
//     }
//   | {
//       isViewing: false;
//       formError?: FormErrorType<GetFarmerProfilePersonalInfoQueryReturnType>;
//       handleChangeState?: (
//         e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
//       ) => void;
//     }

export type InputComponentPropType = {
  labelMessage: string;
  inputType?: string;
  inputName: keyof GetFarmerProfilePersonalInfoQueryReturnType;
  inputPlaceholder?: string;
};

export type propValFunctionReturnType =
  | inputElementReturnPropType
  | selectElementReturnPropType;

export type inputElementReturnPropType =
  | { inputDefaultValue: string | number | boolean | Date | undefined }
  | {
      inputValue: string | number | boolean | undefined;
      formError: string[] | undefined;
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    };

export type selectElementReturnPropType =
  | { selectDefaultValue: string | number | boolean | Date | undefined }
  | {
      selectValue: string | number | boolean | undefined;
      formError: string[] | undefined;
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    };

export type MyOrganizationFormPropType = {
  availOrgList: QueryAvailableOrgReturnType[];
  userOrgInfo: GetFarmerProfileOrgInfoQueryReturnType;
};

export type UserOrganizationInfoFormPropType = {
  userOrgInfo: GetFarmerProfileOrgInfoQueryReturnType;
};
// | {
//     isViewing: false;
//     orgInfo: OrgInfoType;
//     handleUserOrgChange: (
//       e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
//     ) => void;
//     availOrgList: QueryAvailableOrgReturnType[];
//     formError: FormErrorType<OrgInfoType>;
//     otherOrg: boolean;
//   }

export type OrgInfoType = z.infer<typeof userProfileOrgUpdateSchema>;

export type CreateNewOrgAfterSignUpType = {
  firstName: string;
  lastName: string;
  alias: string;
  mobileNumber: string;
  birthdate: Date;
  farmerBarangay: string;
  memberRole: string;
  orgId: string;
};

export type GetFarmerUserProfileInfoReturnType =
  | SuccessGetMyProfileInfoReturnType
  | {
      success: false;
      isNotValid?: true;
      notifError?: NotificationBaseType[];
      isExist?: false;
    };

export type GetFarmerCropInfoQueryReturnType = {
  dayPlanted: Date;
  cropLocation: string;
  farmAreaMeasurement: string;
};

export type GetFarmerCropInfoReturnType =
  | {
      success: true;
      cropData: GetFarmerCropInfoQueryReturnType;
    }
  | ServerActionFailBaseType;

export type ProfileInfoReturnType = {
  cropInfo: getFarmerCropNameQueryReturnType[];
  farmerInfo: GetFarmerProfilePersonalInfoQueryReturnType;
  orgInfo: GetFarmerProfileOrgInfoQueryReturnType;
};

export type SuccessGetMyProfileInfoReturnType = ProfileInfoReturnType & {
  success: true;
};

export type GetMyProfileInfoReturnType =
  | SuccessGetMyProfileInfoReturnType
  | ServerActionFailBaseType;

export type FormErrorType<T> = { [key in keyof T]?: string[] } | null;

export type UpdateUserProfileInfoReturnType = {
  notifMessage: NotificationBaseType[];
} & (
  | {
      success: true;
    }
  | {
      success: false;
      formError?: FormErrorType<GetFarmerProfilePersonalInfoQueryReturnType>;
    }
);

export type ChildrenType = Readonly<ReactNode>;

export type ChildrenPropType = Readonly<{ children?: ChildrenType }>;

export type InputPropType = {
  type?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
};

export type LabelType = ChildrenPropType & {
  htmlFor: string;
  className?: string;
};

export type TitleType = ChildrenPropType & {
  className?: string;
};

export type SelectType = ChildrenPropType & {
  value?: string;
  name?: string;
  className?: string;
  disable?: boolean;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export type OptionType = ChildrenPropType & {
  className?: string;
  value: string | number;
};

export type PType = ChildrenPropType & {
  className?: string;
};

export type FormType = ChildrenPropType & {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  className?: string;
};

export type DivPropType = ChildrenPropType & {
  className?: string;
};

export type FormDivLabelInputPropType = ChildrenPropType & {
  labelMessage: string;
  labelClassName?: string;
  divClassName?: string;
  labelOnClick?: () => void;
  inputType?: string;
  formError?: string[];
  inputDisable?: boolean;
  inputMax?: string | number;
  inputMin?: string | number;
  inputName: string;
  inputChecked?: boolean;
  inputValue?: string;
  inputClassName?: string;
  inputDefaultValue?: string;
  inputPlaceholder?: string;
  inputRequired?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type FormDivLabelTextAreaPropType =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    textAreaName: string;
    labelMessage: string;
    labelClassName?: string;
    labelOnClick?: () => void;
    textAreaRequired?: string;
  };

export type FormDivLabelSelectType = {
  labelMessage: string;
  selectValue?: string;
  selectDefaultValue?: string;
  selectName: string;
  selectOrganization?: boolean;
  selectDisable?: boolean;
  selectRequired?: boolean; // what you should pass in here is always a function
  childrenOption: Readonly<ReactNode>;
  optionDefaultValueLabel?: { value: string | number; label: string };
  optionOtherValAndLabel?: { value: string | number; label: string }[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  formError?: string[];
};

export type FormDivInputRadioPropType = {
  radioList: { radioValue: string; radioLabel: string }[];
  inputName: string;
  inputVal: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  divClassName?: string;
  inputClassName?: string;
  formError?: string[];
};

export type LogoPropType = {
  logo: LucideIcon;
  className?: string;
};

export type ButtonTypeAttribType = "button" | "submit" | "reset";

export type ButtonPropType = ChildrenPropType &
  ButtonHTMLAttributes<HTMLButtonElement>;

export type FormCancelSubmitButtonPropType = {
  divClassName?: string;
  submitOnClick?: () => void;
  submitButtonLabel: string;
  submitLogo?: LucideIcon;
  submitClassName?: string;
  submitType?: ButtonTypeAttribType;
  cancelOnClick?: () => void;
  cancelButtonLabel: string;
  cancelLogo?: LucideIcon;
  cancelClassName?: string;
};

export type ModalNoticePropType = {
  type: "error" | "warning";
  title: string;
  message: ChildrenType;
  onClose: () => void;
  onProceed?: () => void;
  showCancelButton: boolean;
  cancel?: { label: string; className?: string };
  proceed?: { label: string; className?: string };
};

export type NewOrgType = {
  orgId: string | null;
  orgRole: string | null;
  farmerId: string;
};

export type UpdateUserProfileOrgReturnType = {
  notifMessage: NotificationBaseType[];
} & (
  | {
      success: true;
      newOrgIdVal: string;
    }
  | {
      success: false;
      formError?: FormErrorType<OrgInfoType>;
    }
);

export type ViewAllVerifiedFarmerUserQueryReturnType = {
  farmerId: string;
  farmerName: string;
  farmerAlias: string;
  dateCreated: Date;
  orgRole: string;
  orgName: string;
  reportCount: number;
  cropCount: number;
};

export type ViewAllValidatedFarmerUserReturnType =
  | {
      success: true;
      validatedFarmer: ViewAllVerifiedFarmerUserQueryReturnType[];
    }
  | ServerActionFailBaseType;

export type TablePropType = ChildrenPropType & {
  className?: string;
};

export type CaptionPropType = ChildrenPropType & {
  className?: string;
};

export type TableHeaderPropType = ChildrenPropType & {
  className?: string;
};

export type TableBodyPropType = ChildrenPropType & {
  className?: string;
};

export type TableRowPropType = ChildrenPropType & {
  className?: string;
};

export type TableHeaderCellPropType = ChildrenPropType & {
  className?: string;
  scope?: string;
};

export type TableCellPropType = ChildrenPropType & {
  className?: string;
};

export type TableComponentPropType = {
  tableTitle?: string;
  tableClassName?: string;
  noContentMessage: string;
  listCount: number;
  tableHeaderCell: Readonly<ReactNode>;
  tableCell: Readonly<ReactNode>;
};

export type ViewAllUnvalidatedFarmerQueryReturnQuery = {
  farmerId: string;
  farmerName: string;
  farmerAlias: string;
  dateCreated: Date;
  verified: boolean;
  orgRole: string;
  orgName: string;
};

export type ViewAllUnvalidatedFarmerReturnType =
  | {
      success: true;
      notValidatedFarmer: ViewAllUnvalidatedFarmerQueryReturnQuery[];
    }
  | ServerActionFailBaseType;

export type approvedButtonProp = {
  farmerId: string;
};

export type ApprovedOrgMemberButtonPropType = approvedButtonProp & {
  verificationStatus: boolean;
};

export type DynamicLinkPropType = {
  baseLink: "farmerUser" | "agriculturist/organizations";
  dynamicId: string;
  label?: string;
  className?: string;
};

type deleteUserBaseType = {
  farmerName: string;
};

export type deleteMyOrgMemberPropType = deleteUserBaseType & {
  farmerId: string;
};

export type DeleteUserPropType = deleteUserBaseType & {
  isEnglish: boolean;
  deleteOnClick: () => void;
};

export type GetAllOrganizationQueryReturnType = {
  orgId: string;
  orgName: string;
  farmerLeaderName: string;
  farmerId: string;
  totalMember: number;
};

export type GetAllOrganizationReturnType =
  | {
      success: true;
      orgList: GetAllOrganizationQueryReturnType[];
    }
  | ServerActionFailBaseType;

export type GetAllOrgMemberListQueryReturnType = {
  farmerId: string;
  farmerName: string;
  farmerAlias: string;
  barangay: string;
  verified: boolean;
  orgRole: string;
};

export type GetAllOrgMemberListReturnType =
  | { success: true; memberList: GetAllOrgMemberListQueryReturnType[] }
  | (ServerActionFailBaseType & { isExist?: boolean });

export type AgriculturistNavLinkType = {
  link: string;
  logo: LucideIcon;
  linkName: string;
};

export type FarmerUserProfilePropType = {
  userFarmerInfo: ProfileInfoReturnType;
  isViewing: boolean;
};

export type ViewCropModalButtonPropType = {
  cropInfo: getFarmerCropNameQueryReturnType[];
  isViewing: boolean;
};

export type UserProFilePropType = {
  userFarmerInfo: GetFarmerProfilePersonalInfoQueryReturnType;
  orgInfo: GetFarmerProfileOrgInfoQueryReturnType;
  orgList: QueryAvailableOrgReturnType[];
  isViewing: boolean;
};

export type barangayType =
  | "balayhangin"
  | "bangyas"
  | "dayap"
  | "hanggan"
  | "imok"
  | "kanluran"
  | "lamot 1"
  | "lamot 2"
  | "limao"
  | "mabacan"
  | "masiit"
  | "paliparan"
  | "perez"
  | "prinza"
  | "san isidro"
  | "santo tomas"
  | "silangan";

export type brangayWithCalauanType = barangayType | "calauan";

export type pointCoordinatesType = Record<brangayWithCalauanType, number[]>;

export type polygonCoordinatesType = Record<
  brangayWithCalauanType,
  number[][][]
>;

export type MapComponentPropType = ChildrenPropType &
  MapProps & {
    cityToHighlight?:
      | FeatureCollection<Geometry, GeoJsonProperties>
      | Feature<Polygon, GeoJsonProperties>;
    ref?: Ref<MapRef>;
    mapWidth?: string | number;
    mapHeight: string | number;
  };

export type getPointCoordinateReturnType = {
  longitude: number;
  latitude: number;
};

export type GetMyCropInfoQueryRetrunType = {
  cropId: string;
  cropLocation: barangayType;
  farmAreaMeasurement: string;
  cropName: string;
  cropLng: number;
  cropLat: number;
};

export type GetMyCropInfoReturnType =
  | ServerActionFailBaseType
  | {
      success: true;
      myCropInfoList: GetMyCropInfoQueryRetrunType[];
    };

export type FarmerCropPagePropType = {
  myCropInfoList: GetMyCropInfoQueryRetrunType[];
};

export type FarmerCropPageShowModalStateType = {
  addModal: boolean;
  editModal: boolean;
  deleteModal: boolean;
  cropHasReportModal: boolean;
};

export type FarmerCropPageHandleOpenModalParamType =
  | {
      modalName: "addModal" | "cropHasReportModal";
    }
  | {
      modalName: "editModal" | "deleteModal";
      cropId: string;
    };

export type intoFeatureCollectionDataParam =
  | { type: "polygon"; coordinates: number[][][]; name: string }
  | { type: "point"; coordinates: { lng: number; lat: number }; name: string };

export type MapSourceComponentPropType = {
  data?:
    | FeatureCollection<Geometry, GeoJsonProperties>
    | Feature<Polygon, GeoJsonProperties>;
};

export type MapMarkerComponentPropType = {
  markerLng: number;
  markerLat: number;
};

export type FormCropModalPropType = {
  hideCropModal: () => void;
  formSubmit: (
    e: FormEvent<HTMLFormElement>,
    cropInfo: FarmerSecondDetailFormType
  ) => void;
  formTitle: string;
  cropVal?: GetMyCropInfoQueryRetrunType;
  error?: FormErrorType<FarmerSecondDetailFormType>;
};

export type AddCropModalPropType = {
  hideAddCropModal: () => void;
};

export type EditCropModalPropType = {
  myCropInfoList: GetMyCropInfoQueryRetrunType;
  hideEditCropModal: () => void;
  setCropIdToModify: Dispatch<SetStateAction<string | null>>;
};

export type CropFormPropType = {
  currentCrops: FarmerSecondDetailFormType;
  handleChangeVal: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  mapRef: Ref<MapRef>;
  mapHeight: string | number;
  mapOnClick: (e: MapMouseEvent) => void;
  formError: FormErrorType<FarmerSecondDetailFormType>;
};

export type FormMapComponentPropType = {
  label?: string;
  mapRef: Ref<MapRef>;
  mapHeight: string | number;
  cityToHighlight: brangayWithCalauanType;
  mapOnClick: (e: MapMouseEvent) => void;
  coor: { lng: number; lat: number };
  formError?: string[];
};

export type UpdateUserCropInfoReturnType = {
  notifMessage: NotificationBaseType[];
} & (
  | {
      success: true;
    }
  | {
      success: false;
      formError?: FormErrorType<FarmerSecondDetailFormType>;
      closeModal?: true;
    }
);

export type DeleteUserCropInfoReturnType = {
  notifMessage: NotificationBaseType[];
} & (
  | {
      success: true;
    }
  | {
      success: false;
      openNotifModal?: true;
    }
);

export type AddUserCropInfoReturnType = {
  notifMessage: NotificationBaseType[];
} & (
  | { success: true }
  | { success: false; formError?: FormErrorType<FarmerSecondDetailFormType> }
);

export type GetAllCropInfoQueryReturnType = {
  cropId: string;
  cropLocation: string;
  farmerId: string;
  farmAreaMeasurement: string;
  cropName: string;
  cropLng: number;
  cropLat: number;
  farmerName: string;
  farmerAlias: string;
};

export type GetAllCropInfoReturnType =
  | ServerActionFailBaseType
  | {
      success: true;
      allCropInfo: GetAllCropInfoQueryReturnType[];
    };

export type AllFarmerCropPropType = {
  cropInfo: GetAllCropInfoQueryReturnType[];
};

export type ViewUserReportTableDataPropType = {
  reportId: string;
  farmerName?: string;
  label?: string;
  className?: string;
  myReport?: boolean;
};

export type newUserValNeedInfoReturnType =
  | {
      success: true;
      isExist: boolean;
      orgList: QueryAvailableOrgReturnType[];
    }
  | ServerActionFailBaseType;

export type FarmerDetailFormPropType = {
  orgList: QueryAvailableOrgReturnType[];
  farmerInfoExist: boolean;
};

export type checkFarmerRoleReturnType =
  | {
      success: true;
      role: string;
    }
  | ServerActionFailBaseType;

export type DashboardCardPropType = {
  logo: { icon: LucideIcon; iconStyle: string; iconWrapperStyle: string };
  cardLabel: { label: string; className?: string };
  link: string;
  cardContent: string;
  contentLabel: string;
};

type lineChartDataType = {
  week: getReportCountThisWeekReturnType[];
  month: getReportCountThisAndPrevMonthReturnType[];
  year: getReportCountThisYearReturnType[];
};

type workRoleType = "farmer" | "agriculturist";

export type LineChartComponentPropType = {
  title: string;
  user: workRoleType;
  data: lineChartDataType;
};

export type getFarmerCropNameReturnType =
  | {
      success: true;
      cropList: getFarmerCropNameQueryReturnType[];
    }
  | ServerActionFailBaseType;

export type getReportCountThisWeekReturnType = {
  dayOfWeek: string;
  reportCount: number;
};

export type getReportCountThisAndPrevMonthReturnType = {
  weekLabel: string;
  reportCount: number;
};

export type getReportCountThisYearReturnType = {
  month: string;
  reportCount: number;
};

export type farmerRoleType = "leader" | "farmer";

export type agriRoleType = "agriculturist" | "admin";

export type allUserRoleType = farmerRoleType | agriRoleType;

export type barDataStateType = {
  label: string[];
  data: number[];
};

type timeStampzType = {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export type getRecentReportReturnType = {
  farmerFirstName: string;
  farmerLastName: string;
  pastTime: timeStampzType;
  reportId: string;
  barangay: string;
};

export type WeatherComponentPropType = {
  user: allUserRoleType;
  userLocation: barangayType;
};

export type weatherBaseLinkParameterType = {
  lat: number;
  lng: number;
};

export type weatherLocationObjectType = {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string; // 2025-10-07 22:45
};

export type weatherCurrentObjectType = {
  last_updated: string; // 2025-10-07 22:45
  temp_c: number;
  is_day: 1 | 0;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  humidity: number;
  heatindex_c: number;
};

export type weatherForecastObjectType = {
  forecastday: {
    date: string;
    day: {
      maxtemp_c: number;
      mintemp_c: number;
      avgtemp_c: number;
      daily_will_it_rain: 1 | 0;
      daily_chance_of_rain: number;
    };
    hour: {
      time: string;
      temp_c: number;
      is_day: 1 | 0;
      condition: {
        text: string;
        icon: string;
        code: number;
      };
      heatindex_f: number;
      chance_of_rain: number;
    }[];
  }[];
};

export type currentWeatherType = {
  location: weatherLocationObjectType;
  current: weatherCurrentObjectType;
};

export type forecastWeatherType = currentWeatherType & {
  forecast: weatherForecastObjectType;
};

export type getWeatherTodayReturnType =
  | {
      success: true;
      weatherData: weatherCurrentObjectType;
    }
  | ServerActionFailBaseType;

export type reportPerDayWeekAndMonthReturnType =
  | {
      success: true;
      reportCountThisWeek: getReportCountThisWeekReturnType[];
      reportCountThisAndPrevMonth: getReportCountThisAndPrevMonthReturnType[];
      reportCountThisYear: getReportCountThisYearReturnType[];
    }
  | ServerActionFailBaseType;

export type reportAndLocType = {
  reportSequence: lineChartDataType;
  userLocation: barangayType;
};

export type reportSequenceAndUserLocReturnType =
  | ServerActionFailBaseType
  | ({
      success: true;
    } & reportAndLocType);

export type getFamerLeaderDashboardDataReturnType =
  | ServerActionFailBaseType
  | ({
      success: true;
      cardValue: {
        orgMemberTotalReportToday: number;
        totalUnvalidatedReport: number;
        totalUnverfiedUser: number;
      };
      recentReport: getRecentReportReturnType[];
    } & reportAndLocType);

export type getFarmerDashboardDataReturnType =
  | ServerActionFailBaseType
  | ({
      success: true;
      cardValue: {
        countMadeReportToday: number;
        countTotalReportMade: number;
        countPendingReport: number;
      };
    } & reportAndLocType);

export type DashboardComponentPropType = {
  user: allUserRoleType;
  card1: DashboardCardPropType;
  card2: DashboardCardPropType;
  card3: DashboardCardPropType;
  lineChart: { title: string; user: workRoleType; data: lineChartDataType };
  userLocation: barangayType;
  widget?: ChildrenType;
  showQuickAction?: boolean;
};

export type RecentReportWidgetReturnType = {
  recentReport: getRecentReportReturnType[];
  widgetTitle: string;
};

export type verificationStatusType = "false" | "pending";

export type getTotalFarmerStatusType = {
  pending: verificationStatusType;
  false: verificationStatusType;
};

export type getRecentReportParamType =
  | { userRole: "leader"; leaderId: string }
  | { userRole: "agriculturist" };

export type getAgriculturistDashboardDataReturnType =
  | {
      success: true;
      cardValue: {
        totalFarmerReport: number;
        toalNewFarmerReportToday: number;
        totalNotVerifiedFarmer: number;
      };
      reportSequence: lineChartDataType;
      recentReport: getRecentReportReturnType[];
    }
  | ServerActionFailBaseType;

export type getCountNotVerifiedFarmerParamType =
  | { userRole: "leader"; leaderId: string }
  | { userRole: "agriculturist" };

type UserReportDetailsBasePropType = {
  userReport: ReportDetailType;
  closeModal: () => void;
  farmerName?: string;
};

export type EditableUserReportDetailsPropType =
  UserReportDetailsBasePropType & {
    reportId: string;
  };

export type UserReportDetailsPropType = UserReportDetailsBasePropType & {
  isView: boolean;
  work: allUserRoleType;

  // props for changing the value of the description(for farmer leader only)
  textAreaOnChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  proceedOnClick?: () => void;
  backDefault?: () => void;
  textAreaValue?: string;
  isChange?: boolean;
};

export type UserReportModalPropType = {
  reportId: string;
  closeModal: () => void;
  farmerName?: string;
  myReport: boolean;
};

export type changeApproveOrJustApproveReportReturnType = {
  notifMessage: NotificationBaseType[];
};

export type changeApproveOrJustApproveReportParamType = {
  reportId: string;
  isChange: boolean;
  newDesc: string;
};

export type userProfileInfoType = z.infer<typeof userProfileInfoUpdateSchema>;

export type CreateResetPasswordButtonPropType = {
  label?: string;
  labelClassName?: string;
  resetStyle?: boolean;
};

export type getFarmerDataForResetingPassReturnType = {
  farmerId: string;
  username: string;
  farmerName: string;
};

export type getAllFarmerForResetPassReturnType =
  | {
      success: true;
      farmerData: getFarmerDataForResetingPassReturnType[];
    }
  | ServerActionFailBaseType;

export type createSignUpLinkForAgriQueryParamType = {
  linkId: string;
  dateCreated: Date;
  dateExpired: Date;
  link: string;
  linkToken: string;
};

export type createResetPassWordLinkQueryParamType =
  createSignUpLinkForAgriQueryParamType & {
    farmerId: string;
  };

export type serverActionNormalReturnType = {
  success: boolean;
  notifMessage: NotificationBaseType[];
};

export type getLinkQueryReturnTyepe = {
  linkId: string;
  link: string;
  dateCreated: Date;
  dateExpired: Date;
};

export type getLinkResetPassQueryReturnType = getLinkQueryReturnTyepe & {
  farmerName: string;
  username: string;
};

export type getAllLinkDataReturnType =
  | ({
      success: true;
      resetPassLink: getLinkResetPassQueryReturnType[];
    } & (
      | {
          work: "admin";
          createAgriLink: getLinkQueryReturnTyepe[];
        }
      | { work: "agriculturist" }
    ))
  | ServerActionFailBaseType;

export type tableNoDataPropType = {
  message: string;
};

export type ShowIsExpiredPropType = {
  expiredAt: Date;
};

export type checkIsRestPassVarReturnType = {
  isExist: boolean;
  notFound?: true;
};

export type linkTableType = "signUpLinkForAgri" | "resetFarmerPassLink";

export type serverActionOptionalNotifMessage =
  | {
      success: true;
    }
  | ServerActionFailBaseType;
