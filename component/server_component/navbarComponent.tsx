import { GetSession } from "@/lib/session";
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
import { FC, ReactNode } from "react";
import { RedirectLoginWithError } from "@/util/helper_function/reusableFunction";

export const NavbarComponent: FC = async () => {
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
    <div className="w-64 min-h-full bg-white border-r border-gray-200 flex flex-col">
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
    </>
  );

  return <Navbar>{Links}</Navbar>;
};

const AgriculturistNav: FC<{ role: string }> = ({ role }) => {
  const basePage = "/agriculturist";

  const Links = (
    <>
      <Link href={basePage} className="group nav-link">
        <Home className="logo" />
        <span className="nav-span">Home</span>
      </Link>

      <Link href={`${basePage}/farmerReports`} className="group nav-link">
        <ClipboardPlus className="logo" />

        <span className="nav-span">Reports</span>
      </Link>

      <Link href={`${basePage}/crops`} className="group nav-link">
        <Sprout className="logo" />
        <span className="nav-span">Crops</span>
      </Link>

      <div className="nav-divider title">Farmers</div>

      <Link href={`${basePage}/farmerUsers`} className="group nav-link">
        <ContactRound className="logo" />
        <span className="nav-span">Farmer Users</span>
      </Link>

      <Link href={`${basePage}/validateFarmer`} className="group nav-link">
        <ContactRound className="logo" />
        <span className="nav-span">Validate Farmer</span>
      </Link>

      <Link href={`${basePage}/organizations`} className="group nav-link">
        <Building2 className="logo" />
        <span className="nav-span">Organizations</span>
      </Link>

      {role === "admin" && (
        <Link href={`${basePage}/agriUsers`} className="group nav-link">
          <ClipboardCheck className="logo" />
          <span className="nav-span">Agriculturist</span>
        </Link>
      )}

      <Link href={`${basePage}/profile`} className="group nav-link">
        <UserPen className="logo" />

        <span className="nav-span">Profile</span>
      </Link>
    </>
  );

  return <Navbar>{Links}</Navbar>;
};

const Navbar: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <nav className="flex-1 py-4">
      <div className="px-3 space-y-1">{children}</div>
    </nav>
  );
};
