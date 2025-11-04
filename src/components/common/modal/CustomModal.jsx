import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React from "react";

function CustomModal({
  isOpen,
  onOpenChange,
  title = "Modal Title",
  children,
  footerAction = null,
  isDismissable = true,
  ...rest
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      classNames={{
        closeButton: "cursor-pointer",
      }}
      {...rest}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody className={`${footerAction ? "pb-0" : "pb-5"}`}>
              {children}
            </ModalBody>
            {footerAction && (
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={footerAction}>
                  Action
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CustomModal;
