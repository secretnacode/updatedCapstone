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
import { RedirectLoginWithError } from "@/util/helper_function/reusableFunction";

export const NavbarComponent: FC = async () => {
  console.log("Navbar main component");
  const session = await GetSession();
  let role = "";

  try {
    if (session) role = session.work;
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
    session?.work === "farmer" || session?.work === "leader" ? (
      <FarmerNav role={role} />
    ) : (
      <AgriculturistNav role={role} />
    );

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <Link href={`/${session?.work}`} className="p-6 border-b border-gray-200">
        <h1 className="font-bold italic text-2xl title text-green-800 tracking-wide">
          AgroFarm
        </h1>
      </Link>
      {navbar}
    </div>
  );
};

const FarmerNav: FC<{ role: string }> = ({ role }) => {
  const basePage = "/farmer";
  let navbar: NavbarType = [
    { page: basePage, pageLabel: "Home", logo: Home },
    { page: `${basePage}/report`, pageLabel: "Ulat", logo: ClipboardPlus },
    { page: `${basePage}/crop`, pageLabel: "Pananim", logo: Sprout },
    { page: `${basePage}/profile`, pageLabel: "Profile", logo: UserPen },
  ];

  if (role === "leader")
    navbar = [
      ...navbar.slice(0, 3),
      {
        page: `${basePage}Leader/validateReport`,
        pageLabel: "Ulat ng miyembro",
        logo: ClipboardCheck,
      },
      {
        page: `${basePage}Leader/orgMember`,
        pageLabel: "Mga miyembro",
        logo: ContactRound,
      },
      ...navbar.slice(3),
    ];

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
    <nav className="flex-1 py-4">
      <div className="px-3 space-y-1">
        {pages.map((page) => (
          <Link
            href={page.page}
            key={page.page}
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors group"
          >
            <page.logo className="h-5 w-5 group-hover:text-green-600" />
            <span className="text-sm font-medium">{page.pageLabel}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
