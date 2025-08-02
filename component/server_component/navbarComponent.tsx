import { GetSession } from "@/lib/session";
import { NavbarType } from "@/types";
import {
  Building2,
  ClipboardCheck,
  ClipboardPlus,
  ContactRound,
  Home,
  Sprout,
  UserPen,
} from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Link from "next/link";
import { FC } from "react";
import { GetUserRole } from "@/lib/server_action/farmerDetails";
import { RedirectLoginWithError } from "@/util/helper_function/reusableFunction";

export const NavbarComponent: FC = async () => {
  console.log("Navbar main component");
  const session = await GetSession();
  let role = "";

  try {
    if (session) role = await GetUserRole(session.userId, session.work);
    else
      RedirectLoginWithError([
        {
          message: "Nag expired na ang iyong pag lologin. Mag login uli",
          type: "warning",
        },
      ]);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const err = error as Error;
    RedirectLoginWithError([
      {
        message: err.message,
        type: "warning",
      },
    ]);
  }

  const navbar =
    session?.work === "farmer" ? (
      <FarmerNav role={role} />
    ) : (
      <AgriculturistNav role={role} />
    );

  return (
    <div className="">
      <Link
        href={`/${session?.work}`}
        className="inline-block font-bold italic text-2xl title text-green-800 m-4 tracking-wide"
      >
        AgroFarm
      </Link>
      {navbar}
    </div>
  );
};

const FarmerNav: FC<{ role: string }> = ({ role }) => {
  const basePage = "/farmer";
  const navbar: NavbarType = [
    { page: basePage, pageLabel: "Home", logo: Home },
    { page: `${basePage}/report`, pageLabel: "Ulat", logo: ClipboardPlus },
    { page: `${basePage}/crop`, pageLabel: "Pananim", logo: Sprout },
    { page: `${basePage}/profile`, pageLabel: "Profile", logo: UserPen },
    {
      page: `${basePage}/validateReport`,
      pageLabel: "Ulat ng miyembro",
      logo: ClipboardCheck,
    },
    {
      page: `${basePage}/orgMember`,
      pageLabel: "Mga miyembro",
      logo: ContactRound,
    },
  ];

  // if (role === "leader")
  //   navbar = [
  //     ...navbar.slice(0, 3),
  //     {
  //       page: `${basePage}/validateReport`,
  //       pageLabel: "Ulat ng miyembro",
  //       logo: ClipboardCheck,
  //     },
  //     {
  //       page: `${basePage}/orgMember`,
  //       pageLabel: "Mga miyembro",
  //       logo: ContactRound,
  //     },
  //     ...navbar.slice(3),
  //   ];

  return <Navbar pages={navbar} />;
};

const AgriculturistNav: FC<{ role: string }> = ({ role }) => {
  const basePage = "/agriculturist";
  let navbar: NavbarType = [
    { page: basePage, pageLabel: "Home", logo: Home },
    { page: `${basePage}/reports`, pageLabel: "Reports", logo: ClipboardPlus },
    { page: `${basePage}/crops`, pageLabel: "Crops", logo: Sprout },
    {
      page: `${basePage}/farnerUsers`,
      pageLabel: "Farmers",
      logo: ContactRound,
    },
    {
      page: `${basePage}/organizations`,
      pageLabel: "Organizations",
      logo: Building2,
    },
    { page: `${basePage}/profile`, pageLabel: "Profile", logo: UserPen },
  ];

  if (role === "admin")
    navbar = [
      ...navbar.slice(0, 5),
      {
        page: `${basePage}/agriUsers`,
        pageLabel: "Agriculturist",
        logo: ClipboardCheck,
      },
      ...navbar.slice(5),
    ];

  return <Navbar pages={navbar} />;
};

const Navbar: FC<{ pages: NavbarType }> = ({ pages }) => {
  return (
    <nav>
      {pages.map((page) => (
        <Link href={page.page} key={page.page}>
          {page.pageLabel}
          <page.logo />
        </Link>
      ))}
    </nav>
  );
};
