import { GetSession } from "@/lib/session";
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
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { RedirectLoginWithNotif } from "@/util/helper_function/reusableFunction";
import { AgriculturistNavLinkType } from "@/types";
import {
  BurgerNav,
  LogoutButton,
} from "../client_component/componentForAllUser";

export const NavbarComponent: FC = async () => {
  const session = await GetSession();
  let role = "";

  try {
    if (session) role = session.work;
    else
      RedirectLoginWithNotif([
        {
          message: "Nag expired na ang iyong pag lologin. Mag login uli",
          type: "warning",
        },
      ]);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const err = error as Error;
    RedirectLoginWithNotif([
      {
        message: err.message,
        type: "warning",
      },
    ]);
  }

  const navbar =
    session?.work === "farmer" || session?.work === "leader" ? (
      <FarmerNav role={role} />
    ) : (
      <AgriculturistNav />
    );

  const logoLink = (): string => {
    if (session?.work === "admin" || session?.work === "agriculturist")
      return "/agriculturist";

    if (session?.work === "farmer" || session?.work === "leader")
      return "/farmer";

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

        <div className="md:block hidden">{navbar}</div>

        <div className="md:hidden block absolute left-0 top-0">
          <BurgerNav>{navbar}</BurgerNav>
        </div>
      </div>
    </div>
  );
};

export const FarmerNav: FC<{ role: string }> = ({ role }) => {
  const basePage = "/farmer";

  const Links = (
    <>
      <Link href={basePage} className="group nav-link">
        <Home className="logo" />
        <span className="nav-span">Home</span>
      </Link>

      <Link href={`${basePage}/report`} className="group nav-link">
        <ClipboardPlus className="logo" />
        <span className="nav-span">Ulat</span>
      </Link>

      <Link href={`${basePage}/crop`} className="group nav-link">
        <Sprout className="logo" />
        <span className="nav-span">Pananim</span>
      </Link>

      {role === "leader" && (
        <>
          <Link
            href={`${basePage}Leader/validateReport`}
            className="group nav-link"
          >
            <ClipboardCheck className="logo" />
            <span className="nav-span">Ulat ng miyembro</span>
          </Link>

          <Link href={`${basePage}Leader/orgMember`} className="group nav-link">
            <ContactRound className="logo" />
            <span className="nav-span">Mga miyembro</span>
          </Link>
        </>
      )}

      <Link href={`${basePage}/profile`} className="group nav-link">
        <UserPen className="logo" />
        <span className="nav-span">Profile</span>
      </Link>

      <LogoutButton />
    </>
  );

  return <Navbar>{Links}</Navbar>;
};

const AgriculturistNav: FC = () => {
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
        <Link key={link.link} href={link.link} className="group nav-link">
          <link.logo className="logo"></link.logo>
          <span className="nav-span">{link.linkName}</span>
        </Link>
      ))}
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
