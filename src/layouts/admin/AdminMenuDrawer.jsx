import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import AdminLinks from "./AdminLinks";
import { GiHamburgerMenu } from "react-icons/gi";
import { ThemeSwitcher } from "../../components/common/ThemeSwitcher";
import LogoutButton from "../../components/common/LogoutButton";
import { authAtom } from "../../atoms/authAtom";
import { useAtom } from "jotai";

const AdminMenuDrawer = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user] = useAtom(authAtom);
  return (
    <>
      <div className="block lg:hidden">
        <Button onPress={onOpen} isIconOnly>
          <GiHamburgerMenu />
        </Button>
      </div>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="none"
        classNames={{
          base: "bg-slate-50 dark:bg-slate-900",
          closeButton: "cursor-pointer",
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 ">
                <h1 className="text-large">
                  Hello <span className="font-bold dark:text-white text-black">"{user.name}"</span>
                </h1>
              </DrawerHeader>
              <DrawerBody className="p-4">
                <AdminLinks onClose={onClose} />
              </DrawerBody>
              <DrawerFooter className="flex justify-between items-center gap-4">
                <ThemeSwitcher />
                <LogoutButton />
                {/* <Button color="danger" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AdminMenuDrawer;
