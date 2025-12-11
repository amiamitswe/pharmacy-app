import { Button, Chip, Image, useDisclosure, addToast, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, Divider } from "@heroui/react";
import { useAtom } from "jotai";
import React, { useState, useEffect } from "react";
import { BiEditAlt, BiTrash, BiCheckCircle, BiXCircle } from "react-icons/bi";
import { medicineAtom } from "../../atoms/medicineAtom";
import { BsEye } from "react-icons/bs";
import CustomModal from "../common/modal/CustomModal";
import UpdateMedicineModal from "./modal/UpdateMedicineModal";
import medicineService from "../../api-services/medicineService";

function MedicineList({ editMode, onUpdateSuccess }) {
  const [medicineState] = useAtom(medicineAtom);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmOpenChange } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onOpenChange: onViewOpenChange } = useDisclosure();
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [medicineToToggle, setMedicineToToggle] = useState(null);
  const [viewingMedicineId, setViewingMedicineId] = useState(null);
  const [medicineDetails, setMedicineDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleToggleClick = (medicine) => {
    setMedicineToToggle(medicine);
    onConfirmOpen();
  };

  const handleViewMedicine = (medicineId) => {
    setViewingMedicineId(medicineId);
    setMedicineDetails(null);
    onViewOpen();
  };

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      if (!viewingMedicineId || !isViewOpen) return;

      setLoadingDetails(true);
      try {
        const response = await medicineService.getMedicineById(viewingMedicineId);
        if (response.status === 200 && response.data?.result) {
          setMedicineDetails(response.data.result);
        } else {
          throw new Error("Failed to fetch medicine details");
        }
      } catch (error) {
        console.error("Error fetching medicine details:", error);
        addToast({
          title: "Error",
          description: error?.message || "Failed to load medicine details",
          color: "danger",
        });
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchMedicineDetails();
  }, [viewingMedicineId, isViewOpen]);

  const handleToggleActive = async (onClose) => {
    if (!medicineToToggle?._id) return;

    setTogglingId(medicineToToggle._id);
    try {
      // Default to true if active is undefined
      const currentActive = medicineToToggle.active ?? true;
      const newActiveStatus = !currentActive;
      const response = await medicineService.updateMedicine(medicineToToggle._id, {
        active: newActiveStatus,
      });

      if (response.status === 200) {
        addToast({
          title: "Status updated",
          description: `Medicine is now ${newActiveStatus ? "active" : "inactive"}`,
          color: "success",
        });
        setMedicineToToggle(null);
        onClose?.();
        onUpdateSuccess?.();
      } else {
        throw new Error(response.data?.message || "Failed to update status");
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: error?.message || "Failed to update medicine status",
        color: "danger",
      });
    } finally {
      setTogglingId(null);
    }
  };

  if (medicineState?.loading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
    );
  }

  return (
    <>
      {!medicineState?.medicines?.length && !medicineState?.loading ? (
        <p>No item found</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {medicineState?.medicines?.map((medicine, index) => (
            <div
              key={index}
              className="col-span-2 border-1 border-gray-200 dark:border-gray-700 rounded-md p-4 flex justify-between items-center min-h-[66px]"
            >
              <div className="flex gap-4 justify-between items-center w-full">
              <div className="flex gap-4">

                <div className="flex flex-col gap-4 items-center justify-between">
                  <div className="h-20 w-20">
                  <Image
                    alt="HeroUI hero Image"
                    src={medicine?.picUrl || "https://heroui.com/images/hero-card-complete.jpeg"}
                    width={80}
                    height={80}
                    classNames={{
                      wrapper: "h-20 w-20",
                    }}
                  />
                  </div>
                  <Button
                    size="sm"
                    color="primary"
                    variant="bordered"
                    className="flex md:hidden"
                    isIconOnly
                    onPress={() => handleViewMedicine(medicine._id)}
                  >
                    <BsEye className="text-lg" />
                  </Button>
                </div>
                <div className="flex flex-col">
                <div className="flex flex-row items-end gap-4">
                  <h2 className="capitalize text-xl">{medicine.medicineName}</h2>
                  
                  {(medicine?.active ?? true) ? (
                    <>
                      <p className="text-sm">Available Stock:  <span>{medicine?.availableStatus ? <span className="text-success-300">Available </span> : <span className="text-danger-300">Out of Stock</span>}</span> </p>
                      {medicine?.availableStatus && 
                      <div className="text-sm">Stock:<Chip size="sm" variant="bordered" color="primary" className="ml-2">{medicine.medicineCount}</Chip></div>}
                    </>
                  ) : (
                    <Chip size="sm" color="danger" variant="flat" className="font-semibold">
                      Discontinued
                    </Chip>
                  )}
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <div>
                  {medicine?.generics_and_strengths?.length > 0 && (
                    <p className="capitalize text-sm"> <span className="font-medium">Generic:</span> {medicine.generics_and_strengths.map(item => item.generic.genericName).join(' + ')} - <span className="font-medium">Strength:</span> {medicine.generics_and_strengths.map(item => item.strength).join(' + ')}
                    </p>
                  )}
                  </div>
                    <div className="flex gap-4 flex-wrap">
                      <p className="capitalize text-sm">Company: {medicine.company.company}</p>
                      <p className="capitalize text-sm">Medicine Form: {medicine.medicine_form.medicineForm}</p>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <p className="capitalize text-sm">Price: {medicine.originalPrice}</p>
                      <p className="capitalize text-sm">Price: {medicine.discount}</p>
                      <p className="capitalize text-sm">Price: {medicine.discountPrice}</p>
                    </div>
                  </div>
                </div>

                </div>
                <Button
                    className="hidden md:flex"
                    size="sm"
                    color="primary"
                    variant="bordered"
                    isIconOnly
                    onPress={() => handleViewMedicine(medicine._id)}
                  >
                    <BsEye className="text-lg" />
                  </Button>
              </div>

              {editMode && (
                <div className="flex flex-row gap-2 ml-2">
                  <Button
                    size="sm"
                    color="primary"
                    variant="bordered"
                    isIconOnly
                    onPress={async () => {
                      setSelectedMedicineId(medicine._id);
                      onOpen();
                    }}
                  >
                    <BiEditAlt className="text-lg" />
                  </Button>
                  <Button
                    size="sm"
                    color={(medicine?.active ?? true) ? "success" : "danger"}
                    variant="bordered"
                    isIconOnly
                    isLoading={togglingId === medicine._id}
                    onPress={() => handleToggleClick(medicine)}
                    title={(medicine?.active ?? true) ? "Deactivate medicine" : "Activate medicine"}
                  >
                    {(medicine?.active ?? true) ? (
                      <BiCheckCircle className="text-lg" />
                    ) : (
                      <BiXCircle className="text-lg" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Update Medicine"
        size="5xl"
        scrollBehavior="inside"
        isDismissable={false}
      >
        {selectedMedicineId && (
          <UpdateMedicineModal
            medicineId={selectedMedicineId}
            isOpen={isOpen}
            onClose={() => {
              setSelectedMedicineId(null);
              onOpenChange();
            }}
            onSuccess={() => {
              setSelectedMedicineId(null);
              onOpenChange();
              onUpdateSuccess?.();
            }}
          />
        )}
      </CustomModal>

      <Modal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        size="md"
        isDismissable={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {medicineToToggle
                  ? (medicineToToggle.active ?? true)
                    ? "Deactivate Medicine"
                    : "Activate Medicine"
                  : "Confirm Action"}
              </ModalHeader>
              <ModalBody>
                {medicineToToggle && (
                  <div className="py-2">
                    <p className="text-base mb-2">
                      Are you sure you want to{" "}
                      <span className="font-semibold">
                        {(medicineToToggle.active ?? true) ? "deactivate" : "activate"}
                      </span>{" "}
                      this medicine?
                    </p>
                    <div className="bg-default-100 dark:bg-default-50 rounded-lg p-3 mt-3">
                      <p className="text-sm font-medium capitalize">
                        {medicineToToggle.medicineName}
                      </p>
                      {medicineToToggle.company?.company && (
                        <p className="text-xs text-default-500 mt-1">
                          Company: {medicineToToggle.company.company}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-default-500 mt-4">
                      {(medicineToToggle.active ?? true)
                        ? "This medicine will be marked as inactive and may not be visible to users."
                        : "This medicine will be marked as active and will be visible to users."}
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={() => {
                    setMedicineToToggle(null);
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color={(medicineToToggle?.active ?? true) ? "danger" : "success"}
                  onPress={() => handleToggleActive(onClose)}
                  isLoading={togglingId === medicineToToggle?._id}
                >
                  {(medicineToToggle?.active ?? true) ? "Deactivate" : "Activate"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Medicine Details View Modal */}
      <Modal
        isOpen={isViewOpen}
        onOpenChange={onViewOpenChange}
        size="2xl"
        scrollBehavior="inside"
        isDismissable={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Medicine Details
              </ModalHeader>
              <ModalBody>
                {loadingDetails ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner size="lg" label="Loading medicine details..." />
                  </div>
                ) : medicineDetails ? (
                  <div className="space-y-4 py-2">
                    {/* Image */}
                    {medicineDetails.picUrl && (
                      <div className="flex justify-center">
                        <Image
                          alt={medicineDetails.medicineName}
                          src={medicineDetails.picUrl}
                          className="w-full max-w-xs h-auto rounded-lg"
                        />
                      </div>
                    )}

                    {/* Basic Info */}
                    <div className="flex justify-between items-end gap-4">
                      <div className="flex-1 space-y-2">
                        <h2 className="text-2xl font-semibold capitalize">
                          {medicineDetails.medicineName}
                        </h2>
                        
                        {/* Generics & Strengths */}
                        {medicineDetails.generics_and_strengths?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-default-500 mb-1">Generics & Strengths</p>
                            <div className="flex flex-wrap gap-2">
                              {medicineDetails.generics_and_strengths.map((item, idx) => (
                                <Chip key={idx} size="sm" variant="bordered" className="capitalize">
                                  {item.generic?.genericName || item.generic} - {item.strength}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Status & Stock - Right Side */}
                      <div className="flex flex-col justify-end items-end gap-2">
                        {medicineDetails.active === false && (
                          <Chip size="sm" color="danger" variant="flat">
                            Discontinued
                          </Chip>
                        )}
                        {medicineDetails.active !== false && medicineDetails.availableStatus && (
                          <Chip size="sm" color="success" variant="flat">
                            Available
                          </Chip>
                        )}
                        <Chip size="sm" variant="bordered" color="primary">
                          Stock: {medicineDetails.medicineCount || 0}
                        </Chip>
                      </div>
                    </div>

                    <Divider />

                    {/* Company & Form */}
                    <div className="grid grid-cols-2 gap-4">
                      {medicineDetails.company?.company && (
                        <div>
                          <p className="text-sm font-medium text-default-500 mb-1">Company</p>
                          <p className="text-sm capitalize">{medicineDetails.company.company}</p>
                          {medicineDetails.company.country && (
                            <p className="text-xs text-default-400">{medicineDetails.company.country}</p>
                          )}
                        </div>
                      )}
                      {medicineDetails.medicine_form?.medicineForm && (
                        <div>
                          <p className="text-sm font-medium text-default-500 mb-1">Form</p>
                          <p className="text-sm capitalize">{medicineDetails.medicine_form.medicineForm}</p>
                        </div>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-default-500 mb-1">Original Price</p>
                        <p className="text-sm font-semibold">{medicineDetails.originalPrice} BDT</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-default-500 mb-1">Discounted Price</p>
                        <p className="text-sm font-semibold text-success">
                          {medicineDetails.discountPrice || 
                            (medicineDetails.originalPrice - (medicineDetails.originalPrice * medicineDetails.discount / 100)).toFixed(2)} BDT
                          {medicineDetails.discount && (
                            <span className="text-default-500 ml-2">
                              ({medicineDetails.discount}% discount)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Order Limits */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-default-500 mb-1">Min Order</p>
                        <p className="text-sm">{medicineDetails.minOrder || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-default-500 mb-1">Max Order</p>
                        <p className="text-sm">{medicineDetails.maxOrder || "-"}</p>
                      </div>
                    </div>

                    {/* Unit Info */}
                    {(medicineDetails.unitInfo || medicineDetails.orderUnit) && (
                      <div className="grid grid-cols-2 gap-4">
                        {medicineDetails.orderUnit && (
                          <div>
                            <p className="text-sm font-medium text-default-500 mb-1">Order Unit</p>
                            <p className="text-sm capitalize">{medicineDetails.orderUnit}</p>
                          </div>
                        )}
                        {medicineDetails.unitInfo && (
                          <div>
                            <p className="text-sm font-medium text-default-500 mb-1">Unit Info</p>
                            <p className="text-sm">{medicineDetails.unitInfo}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {medicineDetails.description && (
                      <>
                        <Divider />
                        <div>
                          <p className="text-sm font-medium text-default-500 mb-2">Description</p>
                          <p className="text-sm text-default-600 whitespace-pre-wrap">
                            {medicineDetails.description}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Additional Images */}
                    {medicineDetails.picUrls?.length > 0 && (
                      <>
                        <Divider />
                        <div>
                          <p className="text-sm font-medium text-default-500 mb-2">Additional Images</p>
                          <div className="grid grid-cols-3 gap-2">
                            {medicineDetails.picUrls.map((url, idx) => (
                              <Image
                                key={idx}
                                alt={`${medicineDetails.medicineName} - Image ${idx + 1}`}
                                src={url}
                                className="w-full h-24 object-cover rounded"
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-default-500">
                    No details available
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default MedicineList;
