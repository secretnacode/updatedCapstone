import {
  Building2,
  ClipboardCheck,
  ClipboardPlus,
  ContactRound,
  Home,
  LinkIcon,
  Sprout,
  UserCheck,
  UserPen,
} from "lucide-react";
import Link from "next/link";
import { FC, ReactNode } from "react";
import {
  NotifToUriComponent,
  UnexpectedErrorMessageEnglish,
} from "@/util/helper_function/reusableFunction";
import {
  AgriculturistNavLinkType,
  agriculturistNavPropType,
  farmerNavPropType,
  navbarComponentPropType,
  userWorkReturnType,
} from "@/types";
import {
  AgriLogoutButton,
  BurgerNav,
  FarmerLogoutButton,
} from "../client_component/componentForAllUser";
import { userWork } from "@/lib/server_action/user";
import { redirect } from "next/navigation";

export const NavbarComponent: FC<navbarComponentPropType> = async ({
  currentPage,
  forAgri,
}) => {
  let val: userWorkReturnType;

  try {
    val = await userWork();
  } catch (error) {
    console.error((error as Error).message);

    val = {
      success: false,
      notifError: [{ message: UnexpectedErrorMessageEnglish(), type: "error" }],
    };
  }

  if (!val.success) redirect(`/?notif=${NotifToUriComponent(val.notifError)}`);

  const AgriNavbar = forAgri ? (
    <AgriculturistNav pages={currentPage} />
  ) : (
    <AgriculturistNav />
  );

  const FarmerNavbar =
    (val.work === "farmer" || val.work === "leader") &&
    (forAgri === false ? (
      <FarmerNav role={val.work} pages={currentPage} />
    ) : (
      <FarmerNav role={val.work} />
    ));

  const logoLink = (): string => {
    if (val.work === "admin" || val.work === "agriculturist")
      return "/agriculturist";

    if (val.work === "farmer" || val.work === "leader") return "/farmer";

    console.error(
      "no session detected that's why if the logo was presssed it will redirect you to "
    );
    return "/";
  };

  return (
    <div className="md:w-64 w-full min-h-full bg-white">
      <div className="md:sticky top-0 relative">
        <Link
          href={logoLink()}
          className="p-6 md:border-b md:border-gray-200 inline-block w-full"
        >
          <h1 className="title font-serif font-bold italic !text-2xl !text-green-800 tracking-wide !mb-0 text-center">
            AgroFarm
          </h1>
        </Link>

        <div className="md:block hidden">
          {val.work === "admin" || val.work === "agriculturist"
            ? AgriNavbar
            : FarmerNavbar}
        </div>

        <div className="md:hidden block absolute left-0 top-0">
          <BurgerNav>
            {val.work === "admin" || val.work === "agriculturist"
              ? AgriNavbar
              : FarmerNavbar}
          </BurgerNav>
        </div>
      </div>
    </div>
  );
};

const FarmerNav: FC<farmerNavPropType> = ({ role, pages }) => {
  const basePage = "/farmer";

  const Links = (
    <>
      <Link
        href={basePage}
        className={`group nav-link ${
          pages === "Home" ? "bg-green-50 text-green-700" : ""
        }`}
      >
        <Home className="logo" />
        <span className="nav-span">Home</span>
      </Link>

      <Link
        href={`${basePage}/report`}
        className={`group nav-link ${
          pages === "Ulat" ? "bg-green-50 text-green-700" : ""
        }`}
      >
        <ClipboardPlus className="logo" />
        <span className="nav-span">Ulat</span>
      </Link>

      <Link
        href={`${basePage}/crop`}
        className={`group nav-link ${
          pages === "Pananim" ? "bg-green-50 text-green-700" : ""
        }`}
      >
        <Sprout className="logo" />
        <span className="nav-span">Pananim</span>
      </Link>

      {role === "leader" && (
        <>
          <Link
            href={`${basePage}Leader/validateReport`}
            className={`group nav-link ${
              pages === "Ulat ng miyembro" ? "bg-green-50 text-green-700" : ""
            }`}
          >
            <ClipboardCheck className="logo" />
            <span className="nav-span">Ulat ng miyembro</span>
          </Link>

          <Link
            href={`${basePage}Leader/orgMember`}
            className={`group nav-link ${
              pages === "Mga miyembro" ? "bg-green-50 text-green-700" : ""
            }`}
          >
            <ContactRound className="logo" />
            <span className="nav-span">Mga miyembro</span>
          </Link>
        </>
      )}

      <Link
        href={`${basePage}/profile`}
        className={`group nav-link ${
          pages === "Profile" ? "bg-green-50 text-green-700" : ""
        }`}
      >
        <UserPen className="logo" />
        <span className="nav-span">Profile</span>
      </Link>

      <FarmerLogoutButton />
    </>
  );

  return <Navbar>{Links}</Navbar>;
};

const AgriculturistNav: FC<agriculturistNavPropType> = ({ pages }) => {
  const basePage = "/agriculturist";

  const links: AgriculturistNavLinkType[] = [
    { link: basePage, logo: Home, linkName: "Home" },
    {
      link: `${basePage}/farmerReports`,
      logo: ClipboardPlus,
      linkName: "Reports",
    },
    {
      link: `${basePage}/crops`,
      logo: Sprout,
      linkName: "Crops",
    },
    {
      link: `${basePage}/farmerUsers`,
      logo: ContactRound,
      linkName: "Farmer Users",
    },
    {
      link: `${basePage}/validateFarmer`,
      logo: UserCheck,
      linkName: "Validate Farmer",
    },
    {
      link: `${basePage}/organizations`,
      logo: Building2,
      linkName: "Organizations",
    },
    {
      link: `${basePage}/createLink`,
      logo: LinkIcon,
      linkName: "Create Link",
    },
  ];

  return (
    <Navbar>
      {links.map((link) => (
        <Link
          key={link.link}
          href={link.link}
          className={`group nav-link ${
            pages === link.linkName ? "bg-green-50 text-green-700" : ""
          }`}
        >
          <link.logo className="logo"></link.logo>
          <span className="nav-span">{link.linkName}</span>
        </Link>
      ))}

      <AgriLogoutButton />
    </Navbar>
  );
};

const Navbar: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <nav className="flex-1 py-4">
      <div className="px-3 space-y-1">{children}</div>
    </nav>
  );
};
