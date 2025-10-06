"use client";
import React from "react";
import Logo, { LogoMobile } from "./Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcherBtn } from "./ThemeSwitcherBtn";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, MenuIcon } from "lucide-react";

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavBar />
    </>
  );
}

const items = [
  { label: "Painel de Controle", link: "/" },
  { label: "Transações", link: "/transactions" },
  { label: "Gerenciar", link: "/manage" },
];

function MobileNavBar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className="block border-separete 
        bg-background md:hidden"
    >
      <nav
        className="container flex items-center
            justify-between px-8"
      >
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItem
                  key={item.label}
                  label={item.label}
                  link={item.link}
                  clickCallback={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div
          className="flex h-[80px] min-h-[60px]
        item-center gap-x-4"
        >
          <LogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

function DesktopNavbar() {
  return (
    <div className="hidden h-screen w-[300px] flex-col border-r bg-background md:flex">
      <nav className="flex flex-col items-start gap-y-4 px-6 py-8">
        <div className="flex w-full items-center justify-start">
          <Logo />
        </div>
        <div className="flex w-full flex-col gap-y-2">
          {items.map((item) => (
            <NavbarItem
              key={item.label}
              label={item.label}
              link={item.link}
            />
          ))}
        </div>
      </nav>
      <div className="mt-auto flex flex-col items-center gap-y-4 px-4 py-8">
        <ThemeSwitcherBtn />
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </div>
  );
}

function NavbarItem({
  link,
  label,
  clickCallback,
}: {
  link: string;
  label: string;
  clickCallback?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex w-full items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground",
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -left-1.5 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-foreground" />
      )}
    </div>
  );
}
export default Navbar;
