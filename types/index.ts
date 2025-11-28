import {
  addDamageReportSchema,
  addHarvestingReportSchema,
  addPlantingReportSchema,
  authLogInSchema,
  authSignUpSchema,
  changePasswordSchema,
  farmerSecondDetailFormSchema,
  REPORT_TYPE,
  resetPasswordSchema,
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
  InputHTMLAttributes,
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
      data: { authId: string; password: string; status: farmerAuthStatusType };
    };

export type farmerAuthStatusType = "active" | "block" | "delete";

export type AuthResponseType<T> = {
  notifError: NotificationBaseType[];
  formError?: FormErrorType<T>;
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
      work: allUserRoleType;
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

export type createReportFormErrorType = FormErrorType<{
  cropId: string;
  reportType: reportTypeStateType;
}>;

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

export type GetUserReportReturnType = {
  reportId: string;
  cropName: string;
  verificationStatus: boolean;
  dayReported: string;
  dayHappen: string;
  title: string;
  reportType: reportTypeStateType;
};

export type ServerActionFailBaseType = {
  success: false;
  notifError: NotificationBaseType[];
};

export type GetFarmerReportReturnType =
  | {
      success: true;
      userReport: GetUserReportReturnType[];
      work: allUserRoleType;
    }
  | ServerActionFailBaseType;

export type addReportComponentPropType = { openModal: boolean };

export type RemoveSearchParamsValPropType = { name: string };

export type uploadingDamageReportType = z.infer<typeof addDamageReportSchema>;

export type UploadDamageReportFormType =
  FormActionBaseType<uploadingDamageReportType>;

export type uploadPlantingReportType = z.infer<typeof addPlantingReportSchema>;

export type uploadPlantingReportFormType =
  FormActionBaseType<uploadPlantingReportType>;

export type uploadHarvestingReportType = z.infer<
  typeof addHarvestingReportSchema
>;

export type uploadHarvestingReportFormType =
  FormActionBaseType<uploadHarvestingReportType>;

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
  verificationStatus: boolean;
};

export type AddNewFarmerReportImageType = {
  picId: string;
  reportId: string;
  pictureUrl: string;
};

type GetFarmerReportDetailBaseType = {
  cropName: string;
  verificationStatus: boolean;
  dayReported: Date;
  dayHappen: Date;
  title: string;
  description: string;
  cropLat: number;
  cropLng: number;
  cropLocation: barangayType;
};

export type GetFarmerReportDetailQueryReturnType =
  | { isExist: false }
  | {
      isExist: true;
      reportInfo: GetFarmerReportDetailBaseType & {
        pictures: string;
        reportType: reportTypeStateType;
      };
    };

export type ReportDetailType = GetFarmerReportDetailBaseType & {
  pictures: string[];
} & Partial<getDamageInfoReturnType> &
  Partial<getTotalHarvestReturnType> &
  Partial<getPlantedCropTypeReturnType>;

// export type reportDetailTypeWithExtraVal = ReportDetailType &
//   (
//     | ({
//         reportType: Extract<reportTypeStateType, "damage">;
//       } & getDamageInfoReturnType)
//     | ({
//         reportType: Extract<reportTypeStateType, "harvesting">;
//       } & getTotalHarvestReturnType)
//     | ({
//         reportType: Extract<reportTypeStateType, "planting">;
//       } & getPlantedCropTypeReturnType)
//   );

export type GetFarmerReportDetailReturnType =
  | {
      success: true;
      reportDetail: ReportDetailType;
      work: allUserRoleType;
    }
  | ServerActionFailBaseType;

export type GetOrgMemberReportQueryType = {
  reportId: string;
  verificationStatus: boolean;
  dayReported: Date;
  title: string;
  farmerFirstName: string;
  farmerLastName: string;
  farmerAlias: string;
  reportType: reportTypeStateType;
};

export type GetOrgMemberReportReturnType =
  | {
      success: true;
      memberReport: GetOrgMemberReportQueryType[];
    }
  | ServerActionFailBaseType;

export type GetAllFarmerReportQueryReturnType = {
  reportId: string;
  farmerId: string;
  cropLocation: string;
  verificationStatus: string;
  farmerName: string;
  dayReported: Date;
  reportType: reportTypeStateType;
  orgName: string;
};

export type GetAllFarmerReportReturnType =
  | {
      success: true;
      validatedReport: GetAllFarmerReportQueryReturnType[];
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
  status: farmerAuthStatusType;
};

export type GetFarmerOrgMemberReturnType =
  | {
      success: true;
      farmerMember: GetFarmerOrgMemberQueryReturnType[];
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
  status: farmerAuthStatusType;
};

export type getFarmerCropNameQueryReturnType = {
  cropId: string;
  cropName: string;
  cropStatus: cropStatusType;
  datePlanted: Date;
  dateHarvested: Date;
};

export type getCropNameQueryReturnType =
  | { hasCrop: false; notifError: NotificationBaseType[] }
  | { hasCrop: true; cropName: getFarmerCropNameQueryReturnType[] };

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

export type ViewUserProfileFormPropType = MyProfileFormPropType & {
  isEnglish: boolean;
};

export type MyProfileFormPropType = {
  userInfo: GetFarmerProfilePersonalInfoQueryReturnType;
};
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
  userOrgInfo?: GetFarmerProfileOrgInfoQueryReturnType;
};

export type UserOrganizationInfoFormPropType = {
  userOrgInfo?: GetFarmerProfileOrgInfoQueryReturnType;
  isEnglish: boolean;
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
  | (SuccessGetMyProfileInfoReturnType & {
      work: allUserRoleType;
    })
  | {
      success: false;
      notifError: NotificationBaseType[];
    };

export type GetFarmerCropInfoQueryReturnType = {
  cropId: string;
  cropLocation: barangayType;
  farmAreaMeasurement: string;
  cropStatus: cropStatusType;
  datePlanted: Date;
  dateHarvested: Date;
  cropName: string;
};

export type GetFarmerCropInfoReturnType =
  | {
      success: true;
      cropData: GetFarmerCropInfoQueryReturnType[];
    }
  | ServerActionFailBaseType;

export type ProfileInfoReturnType = {
  cropInfo: getFarmerCropNameQueryReturnType[];
  farmerInfo: GetFarmerProfilePersonalInfoQueryReturnType;
  orgInfo?: GetFarmerProfileOrgInfoQueryReturnType;
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

export type AuthFormPropType = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  isHidden: boolean;
  setIsHidden: () => void;
  formError?: string[];
};

export type FormDivLabelInputPropType = ChildrenPropType &
  InputHTMLAttributes<HTMLInputElement> & {
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
    logo?: { icon: LucideIcon; style?: string };
  };

export type FormDivLabelTextAreaPropType =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    labelMessage: string;
    labelClassName?: string;
    labelOnClick?: () => void;
    formError?: string[];
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
  labelClassName?: string;
  logo?: { icon: LucideIcon; style?: string };
};

export type FormDivInputRadioPropType = {
  radioList: { radioValue: string; radioLabel: string }[];
  inputName: string;
  inputVal?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  divClassName?: string;
  inputClassName?: string;
  formError?: string[];
  labelMessage: string;
  labelClassName?: string;
  logo?: { icon: LucideIcon; style?: string };
  required?: boolean;
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
  showCloseButton?: boolean;
  showCancelButton: boolean;
  cancel?: { label: string; className?: string };
  proceed?: {
    label: string;
    className?: string;
  };
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
  status: farmerAuthStatusType;
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

export type deleteFarmerButtonPropType = deleteMyOrgMemberPropType & {
  path: pathToRevalidateAfterAgriDeleteFarmer;
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
  farmerLeaderAlias: string;
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
  | {
      success: true;
      memberList: GetAllOrgMemberListQueryReturnType[];
      orgName: string;
    }
  | (ServerActionFailBaseType & { isExist?: boolean });

export type AgriculturistNavLinkType = {
  link: string;
  logo: LucideIcon;
  linkName: agriPages;
};

export type FarmerUserProfilePropType = {
  userFarmerInfo: ProfileInfoReturnType;
  isViewing: boolean;
};

export type ViewCropModalButtonPropType = {
  isViewing: boolean;
  isEnglish: boolean;
  authStatus: farmerAuthStatusType;
};

export type UserProFilePropType = {
  userFarmerInfo: GetFarmerProfilePersonalInfoQueryReturnType;
  orgInfo?: GetFarmerProfileOrgInfoQueryReturnType;
  orgList: QueryAvailableOrgReturnType[];
  isViewing: boolean;
  work: allUserRoleType;
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
    divClassName?: string;
    divId?: string;
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
  cropStatus: cropStatusType;
  dateHarvested: Date;
  datePlanted: Date;
};

export type GetMyCropInfoReturnType =
  | ServerActionFailBaseType
  | {
      success: true;
      myCropInfoList: GetMyCropInfoQueryRetrunType[];
    };

export type FarmerCropPagePropType = {
  myCropInfoList: GetMyCropInfoQueryRetrunType[];
  addCrop: boolean;
};

export type FarmerCropPageShowModalStateType = {
  addModal: boolean;
  editModal: boolean;
};

export type FarmerCropPageHandleOpenModalParamType =
  | {
      modalName: "addModal";
    }
  | {
      modalName: "editModal";
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
  buttonLabel: { submit: string; cancel: string };
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
  cropLocation: barangayType;
  farmerId: string;
  farmAreaMeasurement: string;
  cropLng: number;
  cropLat: number;
  farmerName: string;
  farmerAlias: string;
  cropStatus: cropStatusType;
  datePlanted: Date;
  dateHarvested: Date;
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
      orgList: QueryAvailableOrgReturnType[];
    }
  | ServerActionFailBaseType;

export type FarmerDetailFormPropType = {
  orgList: QueryAvailableOrgReturnType[];
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
  isEnglish?: boolean;
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

export type timeStampzType = {
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
  importantWidget?: ChildrenType;
  widget?: ChildrenType;
  showQuickAction?: boolean;
};

export type RecentReportWidgetPropType = {
  recentReport: getRecentReportReturnType[];
  widgetTitle: string;
  linkFor: "agri" | "farmer";
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
  myReport: boolean;
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

type linkBaseType = {
  linkId: string;
  dateCreated: Date;
  dateExpired: Date;
  link: string;
  linkToken: string;
  isUsed: boolean;
};

export type createSignUpLinkForAgriQueryParamType = linkBaseType;

export type createResetPassWordLinkQueryParamType = linkBaseType & {
  farmerId: string;
};

export type serverActionNormalReturnType = {
  success: boolean;
  notifMessage: NotificationBaseType[];
};

export type getCreateAgriLinkReturnType = {
  linkId: string;
  link: string;
  dateCreated: Date;
  dateExpired: Date;
};

export type getRestPasswordLinkQueryReturnType = getCreateAgriLinkReturnType & {
  farmerName: string | null;
  username: string | null;
};

export type getAllLinkDataReturnType =
  | {
      success: true;
      work: agriRoleType;
      links: getRestPasswordLinkQueryReturnType[];
    }
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

export type insertNewAgriculturistParamType = {
  agriId: string;
  userName: string;
  name: string;
};

export type agriculturistRoleType = {
  admin: "admin";
  agriculturist: "agriculturist";
};

export type agriIsExistParamType = {
  id: string;
  email: string;
};

export type agriAuthValType = {
  agriId: string;
  agriRole: agriRoleType;
  name: string;
};

export type agriAuthQueryReturnType =
  | { exist: false; message: string }
  | { exist: true; agriVal: agriAuthValType };

export type AgriAuthPropType = {
  handleIsAuthLoaded: (val: boolean) => void;
  handleIsContextLoading: (val: boolean) => void;
};

export type getReportCountPerCropQueryReturnType = {
  reportCount: number;
  cropName: string;
  cropId: string;
};

export type getReportCountPerCropReturnType =
  | { success: true; reportCountVal: getReportCountPerCropQueryReturnType[] }
  | ServerActionFailBaseType;

export type PieChartCardPropType = {
  data: { id: string; value: number; label: string }[];
};

export type getLatestReportQueryReturnType = {
  reportId: string;
  title: string;
  dayReported: Date;
  reportType: reportTypeStateType;
};

export type getLatestReportReturnType =
  | { success: true; reportVal: getLatestReportQueryReturnType[] }
  | ServerActionFailBaseType;

export type ReportContentPropType = {
  selectedCrop: string;
  reportType: reportTypeStateType;
  setOpenReportModal: Dispatch<SetStateAction<boolean>>;
  handleFormError: (formError: createReportFormErrorType) => void;
};

export type reportTypeStateType = (typeof REPORT_TYPE)[number];

export type openCamPropType = {
  setSelectedFile: Dispatch<SetStateAction<AddReportPictureType>>;
  isPassing: boolean;
};

export type cropStatusType = "planted" | "harvested";

export type determineCropStatusParamType = {
  cropStatus: cropStatusType;
  datePlanted?: Date;
  dateHarvested?: Date;
  isEnglish: boolean;
};

export type getCropStatusReturnType = {
  cropStatus: cropStatusType;
};

export type getCropStatusAndExpectedHarvestReturnType =
  getCropStatusReturnType & {
    expectedHarvest: Date;
  };

export type updateCropPantedPropType = {
  cropId: string;
  datePlanted: Date;
};

export type addPlantedCropParamType = {
  plantedId: string;
  reportId: string;
  cropId: string;
  cropType: plantedCropType;
  datePlanted: Date;
  farmerId: string;
};

export type addHarvestedCropParamType = {
  harvestId: string;
  reportId: string;
  cropId: string;
  totalKgHarvested: number;
  dateHarvested: Date;
  farmerId: string;
};

export type createReportPropType = {
  setOpenReportModal: Dispatch<SetStateAction<boolean>>;
};

export type getCropStatusAndPlantedDateReturnType = {
  cropStatus: cropStatusType;
  dateHarvested: Date;
};

export type getMyRecentReportQueryReturnType = {
  reportId: string;
  dayReported: Date;
  verificationStatus: boolean;
  title: string;
  reportType: reportTypeStateType;
};

export type getMyRecentReportReturnType =
  | {
      success: true;
      recentReport: getMyRecentReportQueryReturnType[];
    }
  | ServerActionFailBaseType;

export type MyPreviousReportPropType = { user: farmerRoleType };

export type NoContentYetPropType = ChildrenPropType & {
  message: string;
  logo: LucideIcon;
  parentDiv?: string;
  logoClassName?: string;
  textClassName?: string;
  childrenDivClassName?: string;
  textWrapperDivClassName?: string;
};

export type getMyCropStatusDetailQueryReturnType = {
  cropId: string;
  cropName: string;
  farmAreaMeasurement: string;
  cropStatus: cropStatusType;
  datePlanted: Date;
  dateHarvested: Date;
};

export type getMyCropStatusDetailReturnType =
  | {
      success: true;
      cropInfoStatus: getMyCropStatusDetailQueryReturnType[];
    }
  | ServerActionFailBaseType;

export type TableComponentLoadingPropType = {
  col?: number;
  row?: number;
};

export type determineCropStatusReturnType = {
  status: string;
  className: string;
};

export type ModalNoticeLogoType =
  | { logo: LucideIcon; logoColor: string; bgColor: string }
  | undefined;

export type seeAllValButtonPropType = { link: string };

export type autoOpenMyReportPropType = {
  reportId: string;
};

export type searchParamValue = string | boolean | number;

export type renderNotificationPropType = {
  notif: NotificationBaseType[];
  paramName?: string;
};

export type renderRedirectNotification = { notif: NotificationBaseType[] };

export type reportTypePropType = {
  type: reportTypeStateType;
  isEnglish?: boolean;
  className?: string;
};

export type reportStatusPropType = {
  verificationStatus: boolean;
  className?: string;
};

type filterSortBaseType<T> = {
  obj: T[];
};

export type tableWithFilterPropType<T> = filterSortBaseType<T> &
  Pick<useSortColumnHandlerReturnType<T>, "sortCol" | "setSortCol"> & {
    setTableList: Dispatch<SetStateAction<T[]>>;
    table: ChildrenType;
    additionalFilter?: {
      filterBy: { [key in keyof T]?: allType[] }; // how will the table be filter by (e.g. all is not verified)
      handleFilterLabel: { [key in keyof T]?: (label: string) => string }; // how will it be labeled as (e.g. instead of not verified, it will be verify base on the function's logic that will be passed)
    };
  };

export type sortColType<T> = {
  column: keyof T;
  sortType: "asc" | "desc";
} | null;

export type filteType<T> = {
  col: keyof T;
  val: allType;
} | null;

export type useFilterSortValueParamType<T> = filterSortBaseType<T> & {
  sortCol: sortColType<T>;
  searchVal: string | null;
  filterCol: filteType<T>;
};

export type useSortColumnHandlerReturnType<T> = {
  sortCol: sortColType<T>;
  setSortCol: Dispatch<SetStateAction<sortColType<T>>>;
  handleSortCol: (col: keyof T) => void;
};

export type validateReportTablePropType = {
  memberReport: GetOrgMemberReportQueryType[];
};

export type orgMemberTablePropType = {
  orgMember: GetFarmerOrgMemberQueryReturnType[];
};
export type allType = string | number | boolean | Date;

export type sortColByPropType<T> = Pick<
  useSortColumnHandlerReturnType<T>,
  "sortCol"
> & { col: keyof T };

export type translateReportTypeParamType = {
  type: reportTypeStateType;
  isEnglish?: boolean;
};

export type reportStatusParamType = { val: boolean; isEnglish?: boolean };

export type myReportTablePropType = {
  report: GetUserReportReturnType[];
  work: allUserRoleType;
};

export type agriculturistFarmerReporTablePropType = {
  report: GetAllFarmerReportQueryReturnType[];
};

export type myReportTableLeaderFilterReturnType = {
  filterBy: { GetUserReportReturnType?: allType[] };
  handleFilterLabel: { GetUserReportReturnType?: (label: string) => string };
};

export type getCropCountPerBrgyQueryReturnType = {
  cropCount: number;
  cropLocation: string;
};

export type getCropCountPerBrgyReturnType =
  | { success: true; cropCount: getCropCountPerBrgyQueryReturnType[] }
  | ServerActionFailBaseType;

export type getCropStatusCountQueryReturnType = {
  cropStatus: cropStatusType;
  datePlanted: Date;
  dateHarvested: Date;
};

export type getCropStatusCountCropStatusAccType = {
  status: string;
  count: number;
};

export type getCropStatusCountReturnType =
  | {
      success: true;
      cropStatusCount: getCropStatusCountCropStatusAccType[];
    }
  | ServerActionFailBaseType;

export type agriculturistFarmerUserTablePropType = {
  farmer: ViewAllVerifiedFarmerUserQueryReturnType[];
};

export type agriculturistValidateFarmerTablePropType = {
  farmer: ViewAllUnvalidatedFarmerQueryReturnQuery[];
};

export type agriculturistFarmerOrgTablePropType = {
  orgVal: GetAllOrganizationQueryReturnType[];
};

export type agriculturistOrgMemberTablePropType = {
  orgMem: GetAllOrgMemberListQueryReturnType[];
};

export type dateWithTimeStampPropType = {
  date: Date;
};

export type changePasswordType = z.infer<typeof changePasswordSchema>;

export type changeFarmerPassReturnType = {
  notifMessage: NotificationBaseType[];
} & (
  | { success: false; formError?: FormErrorType<changePasswordType> }
  | { success: true }
);

export type viewUserCropInfoPropType = {
  cropData: GetFarmerCropInfoQueryReturnType[];
  isViewing: boolean;
  work: allUserRoleType;
};

export type profileButtonIdType =
  | "profile-user-info"
  | "profile-org-info"
  | "profile-change-pass";

export type BurgerNavPropType = ChildrenPropType;

export type reportDownloadType = reportTypeStateType | "all";

export type optionsDownloadListType = {
  id: reportDownloadType;
  label: string;
  icon: LucideIcon;
  color: string;
  bgHover: string;
}[];

export type getToBeDownloadReportQueryReturnType = {
  "FIRST NAME": string;
  SURNAME: string;
  "MIDDLE NAME": string;
  "EXTENSION NAME": string;
  "DATE OF BIRTH": string;
  "FARM LOCATION": barangayType;
  "FARM AREA": string;
};

export type keyOfReportToDowload = [keyof getToBeDownloadReportQueryReturnType];

export type getToBeDownloadReportReturnType =
  | { success: true; csvType: string }
  | ServerActionFailBaseType;

export type addDamageReportParamType = {
  damageId: string;
  reportId: string;
  cropId: string;
  farmerId: string;
} & Pick<uploadingDamageReportType, "totalDamageArea">;

export type getDamageInfoReturnType = { totalDamageArea: string };

export type getTotalHarvestReturnType = { totalKgHarvest: number };

export const plantedCrop = ["inbred", "hybrid"] as const;

export type plantedCropType = (typeof plantedCrop)[number];

export type getPlantedCropTypeReturnType = { cropType: plantedCropType };

export type navbarComponentPropType =
  | {
      forAgri?: true;
      currentPage?: agriPages;
    }
  | {
      forAgri?: false;
      currentPage?: farmerPages;
    };

type farmerPages =
  | "Home"
  | "Ulat"
  | "Pananim"
  | "Ulat ng miyembro"
  | "Mga miyembro"
  | "Profile";

type agriPages =
  | "Home"
  | "Reports"
  | "Crops"
  | "Farmer Users"
  | "Validate Farmer"
  | "Organizations"
  | "Create Link";

export type farmerNavPropType = { role: farmerRoleType; pages?: farmerPages };

export type userWorkReturnType =
  | { success: true; work: allUserRoleType }
  | ServerActionFailBaseType;

export type agriculturistNavPropType = { pages?: agriPages };

export type checkUserAlreadyLoginReturnType =
  | { success: true; hasSession: false }
  | ServerActionFailBaseType;

export type adminOrFarmerNavPropType = { work: allUserRoleType } & (
  | {
      currentPage: agriPages;
      forAgri: true;
    }
  | { currentPage: farmerPages; forAgri: false }
);

export type resetPasswordFormPropType = {
  token: string;
};

export type resetPasswordType = z.infer<typeof resetPasswordSchema>;

export type changeNewPassParamType = { token: string } & resetPasswordType;

export type changeNewPassReturnType = ServerActionFailBaseType & {
  formError?: FormErrorType<resetPasswordType>;
};

export type pathToRevalidateAfterAgriDeleteFarmer =
  | "/agriculturist/validateFarmer"
  | "/agriculturist/farmerUsers";

export type blockUserPropType = {
  isEnglish: boolean;
  blockOnClick: () => void;
};

export type blockMyOrgMemberButtonPropType = { farmerId: string };

export type farmerOrgMemberActionPropType = {
  farmerId: string;
  verificationStatus: boolean;
  farmerName: string;
  status: farmerAuthStatusType;
};

export type authBaseDesignPropType = { isEnglish: boolean } & ChildrenPropType;

export const agriculturistCreateLinkTableReturnType = {};
