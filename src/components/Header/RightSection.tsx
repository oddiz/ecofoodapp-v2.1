import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { SignInModal } from "../SignInModal";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { useNavigator } from "hooks/useNavigator";

export const RightSection = () => {
    const { status, data: session } = useSession();

    const router = useRouter();
    const { setActivePage } = useNavigator();
    const [showSignIn, setShowSignIn] = useState(false);

    const userLinkClicked = () => {
        console.log("user link clicked");
        router.push("/user", undefined, { shallow: true });
        setActivePage("user");
    };

    if (status === "loading") {
        return <RightSectionSkeleton />;
    }

    return (
        <div className="flex h-full flex-row items-center justify-end">
            {session ? (
                <Menu>
                    <Menu.Button>
                        <div className="flex h-full flex-row items-center justify-end">
                            <div className="mx-4 font-mono text-xl font-bold dark:text-primary-900">
                                {session?.user?.name}
                            </div>
                            {session?.user?.image && (
                                <Image
                                    src={session.user.image}
                                    alt={"Profile Picture"}
                                    width={55}
                                    height={55}
                                    placeholder="blur"
                                    blurDataURL={session.user.image}
                                    className="shrink-0 rounded-full"
                                />
                            )}
                        </div>
                    </Menu.Button>
                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Menu.Items className="absolute top-10 right-0 flex w-44 flex-col rounded-lg">
                            <div className="h-8 w-full rounded-t-lg border-b-[1px] border-b-primarydark-100 bg-primarydark-300" />
                            <Menu.Item>
                                <button
                                    onClick={userLinkClicked}
                                    className="flex h-10 cursor-pointer items-center justify-center  bg-primarydark-400 px-4 py-2 text-sm font-light hover:bg-primarydark-300"
                                >
                                    Change Username
                                </button>
                            </Menu.Item>
                            <Menu.Item>
                                <button
                                    onClick={() => signOut()}
                                    className="flex h-10 cursor-pointer items-center justify-center rounded-b-lg border-t-2 border-t-ecored-600 bg-ecored-600/80 px-4 py-2 text-center hover:bg-ecored-500"
                                >
                                    Log out
                                </button>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            ) : (
                <Link href={"/signin"}>
                    <button className=" h-10 w-24 rounded border-2 border-secondary-800 text-center font-mono font-extralight hover:brightness-110  dark:text-secondary-200">
                        Sign In
                    </button>
                </Link>
            )}
        </div>
    );
};

const RightSectionSkeleton = () => {
    return (
        <div className="h-100 flex items-center justify-center">
            <div className="mr-3 h-3 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <svg
                className="mr-2 h-14 w-14 text-gray-200 dark:text-gray-700"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                ></path>
            </svg>
        </div>
    );
};
