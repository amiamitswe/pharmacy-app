import React from "react";
import { ThemeSwitcher } from "../../components/common/ThemeSwitcher";
import LogoutButton from "../../components/common/LogoutButton";
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
import { useAtom } from "jotai";
import { authAtom } from "../../atoms/authAtom";

function AdminHeader() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user] = useAtom(authAtom);

  return (
    <>
      <header className="bg-slate-100 dark:bg-slate-900 h-14 p-4 flex justify-between items-center">
        <h1 className="text-large">Hello <span className="font-bold text-white">"{user.name}"</span></h1>
        <div>
          <div className="lg:flex hidden items-center gap-2">
            <ThemeSwitcher />
            <LogoutButton />
          </div>
          <div className="block lg:hidden">
            <Button onPress={onOpen}>Menu</Button>
          </div>
        </div>
      </header>

      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Drawer Title
              </DrawerHeader>
              <DrawerBody>
                <AdminLinks />
              </DrawerBody>
              <DrawerFooter>
                <LogoutButton />
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default AdminHeader;
