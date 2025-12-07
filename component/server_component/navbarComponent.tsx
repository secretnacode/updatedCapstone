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
  UnexpectedErrorMessage,
  UnexpectedErrorMessageEnglish,
} from "@/util/helper_function/reusableFunction";
import {
  AgriculturistNavLinkType,
  agriculturistNavPropType,
  farmerNavPropType,
  getUserNameReturnType,
  navbarComponentPropType,
  topNavbarPropType,
  userWorkReturnType,
} from "@/types";
import {
  AgriLogout,
  BurgerNav,
  FarmerLogout,
  HeaderNotification,
  HeaderUserLogo,
} from "../client_component/componentForAllUser";
import { getUserName, userWork } from "@/lib/server_action/user";
import { redirect } from "next/navigation";
import { RenderNotification } from "../client_component/provider/notificationProvider";

export const NavbarComponent: FC<navbarComponentPropType> = async ({
  currentPage,
  forAgri,
  children,
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
    <>
      <div className="hidden md:block min-w-fit w-64 min-h-full bg-white border-gray-300 border-r">
        <div className="sticky top-0">
          <Link href={logoLink()} className="mt-5 mb-3 inline-block w-full">
            <h1 className="title font-serif font-bold italic !text-2xl !text-green-800 tracking-wide !mb-0 text-center">
              AgroFarm
            </h1>
          </Link>

          <div>
            {val.work === "admin" || val.work === "agriculturist"
              ? AgriNavbar
              : FarmerNavbar}
          </div>
        </div>
      </div>

      {currentPage && (
        <div className="w-full">
          <TopNavbar
            isEnglish={val.work === "admin" || val.work === "agriculturist"}
            currentPage={currentPage}
            burgerNav={
              val.work === "admin" || val.work === "agriculturist"
                ? AgriNavbar
                : FarmerNavbar
            }
            logoLink={logoLink()}
          />

          {children}
        </div>
      )}
    </>
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
        <Home className="nav-logo" />
        <span className="nav-span">Home</span>
      </Link>

      <Link
        href={`${basePage}/report`}
        className={`group nav-link ${
          pages === "Ulat" ? "bg-green-50 text-green-700" : ""
        }`}
      >
        <ClipboardPlus className="nav-logo" />
        <span className="nav-span">Ulat</span>
      </Link>

      <Link
        href={`${basePage}/crop`}
        className={`group nav-link ${
          pages === "Pananim" ? "bg-green-50 text-green-700" : ""
        }`}
      >
        <Sprout className="nav-logo" />
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
            <ClipboardCheck className="nav-logo" />
            <span className="nav-span">Ulat ng miyembro</span>
          </Link>

          <Link
            href={`${basePage}Leader/orgMember`}
            className={`group nav-link ${
              pages === "Mga miyembro" ? "bg-green-50 text-green-700" : ""
            }`}
          >
            <ContactRound className="nav-logo" />
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
        <UserPen className="nav-logo" />
        <span className="nav-span">Profile</span>
      </Link>

      <FarmerLogout useFor={"navbar"} />
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
          <link.logo className="nav-logo"></link.logo>
          <span className="nav-span">{link.linkName}</span>
        </Link>
      ))}

      <AgriLogout useFor={"navbar"} />
    </Navbar>
  );
};

const Navbar: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <nav className="py-4">
      <div className="md:px-3 space-y-1">{children}</div>
    </nav>
  );
};

const TopNavbar: FC<topNavbarPropType> = async ({
  isEnglish,
  currentPage,
  burgerNav,
  logoLink,
}) => {
  let name: getUserNameReturnType;

  try {
    name = await getUserName();
  } catch (error) {
    console.log((error as Error).message);

    name = {
      success: false,
      notifError: [
        {
          message: isEnglish
            ? UnexpectedErrorMessageEnglish()
            : UnexpectedErrorMessage(),
          type: "error",
        },
      ],
    };
  }

  const currentPageTitle = () => {
    switch (currentPage) {
      case "Home":
        return isEnglish
          ? "Welcome back to AgroFarm"
          : "Maligayang pag babalik sa AgroFarm";
      case "Reports":
        return "";
      case "Crops":
        return "";
      case "Farmer Users":
        return "";
      case "Validate Farmer":
        return "";
      case "Organizations":
        return "";
      case "Create Link":
        return "";
      case "Ulat":
        return "";
      case "Pananim":
        return "";
      case "Ulat ng miyembro":
        return "";
      case "Mga miyembro":
        return "";
      case "Profile":
        return "";
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return isEnglish ? "Good Morning," : "Magandang Umaga";
    } else if (hour >= 12 && hour < 17) {
      return isEnglish ? "Good Afternoon," : "Magandang Tanghali";
    } else {
      return isEnglish ? "Good Evening," : "Magandang Gabi";
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white flex justify-between md:justify-end lg:justify-between items-center px-4 py-2 md:px-6 md:py-3 border-b border-gray-300">
      {!name.success && <RenderNotification notif={name.notifError} />}

      <div className="block: md:hidden">
        <BurgerNav isEnglish={isEnglish}>{burgerNav}</BurgerNav>
      </div>

      <div className="relative grid place-items-center md:hidden">
        <Link href={logoLink} className="absolute inline-block -left-8">
          <h1 className="title font-serif font-bold italic !text-2xl !text-green-800 tracking-wide !mb-0 text-center">
            AgroFarm
          </h1>
        </Link>
      </div>

      <div className="hidden lg:flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 ">
          {greeting()}, {name.success ? name.username : "Farmer User"}
        </h2>
        <p className="text-sm text-gray-500">{currentPageTitle()}</p>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <HeaderNotification isEnglish={isEnglish} />

        {name.success ? (
          <HeaderUserLogo
            username={name.username}
            role={name.role}
            email={name.email}
            isEnglish={isEnglish}
          />
        ) : (
          <HeaderUserLogo
            username={"Magsasaka"}
            role={"farmer"}
            email={"Farmer123@gmail.coms"}
            isEnglish={isEnglish}
          />
        )}
      </div>
    </header>
  );
};
