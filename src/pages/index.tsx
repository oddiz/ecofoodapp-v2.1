import { useNavigator } from "@/hooks/useNavigator";
import { useEffect } from "react";
import { useRouter } from "next/router";

const IndexPage = () => {
  const { setActivePage } = useNavigator();
  const router = useRouter();

  useEffect(() => {
    setActivePage("calculator");
    router.push("/calculator").catch((err) => console.error(err));
  }, [setActivePage, router]);

  return <></>;
};

export default IndexPage;
