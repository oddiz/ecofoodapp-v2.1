import { TbMeat } from "react-icons/tb";
import { NavItem } from "./NavItem";
import {
  IoStorefrontSharp,
  IoHeart,
  IoSettingsSharp,
  IoCart,
} from "react-icons/io5";
import Image from "next/image";
import { useNavigator } from "@/hooks/useNavigator";
import Link from "next/link";

export const Navigator: React.FC = () => {
  const navItems = [
    {
      id: "calculator",
      label: "Calculator",
      icon: <TbMeat size={24} />,
      link: "/calculator",
    },
    {
      id: "shops",
      label: "Shops",
      icon: <IoStorefrontSharp size={24} />,
      link: "/shops",
    },
    {
      id: "taste",
      label: "Taste",
      icon: <IoHeart size={24} />,
      link: "/taste",
    },
    {
      id: "shopping-list",
      label: "Cart",
      icon: <IoCart size={24} />,
      link: "/cart",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <IoSettingsSharp size={24} />,
      link: "/settings",
    },
  ];
  const { activePage, setActivePage } = useNavigator();

  const handleNavItemClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const itemExists = navItems.some((item) => item.id === e.currentTarget.id);
    if (itemExists) setActivePage(e.currentTarget.id);
  };

  return (
    <div className="h-full w-24 flex-shrink-0 flex-grow-0 bg-primarydark-700 ">
      <div className="relative mb-12 flex h-24  w-full flex-col p-5">
        <Image src="/logo.png" alt="Eco Food App" width={256} height={256} />
      </div>
      <div id="Navitems" className="flex-grow-1 flex-shrink-1 flex flex-col ">
        {navItems.map((item) => (
          <Link href={item.link} key={item.id}>
            <NavItem
              id={item.id}
              icon={item.icon}
              label={item.label}
              active={item.link === activePage}
              onClickHandler={handleNavItemClick}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
