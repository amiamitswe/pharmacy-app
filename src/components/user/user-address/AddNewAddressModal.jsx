import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Switch,
  addToast,
} from "@heroui/react";
import userService from "../../../api-services/userService";
import CustomModal from "../../common/modal/CustomModal";

const addressTypeOptions = [
  { label: "Home", value: "Home" },
  { label: "Office", value: "Office" },
  { label: "Work", value: "Work" },
  { label: "Other", value: "Other" },
];

const validationSchema = Yup.object({
  addressType: Yup.string().required("Address type is required"),
  street: Yup.string()
    .min(3, "Street must be at least 3 characters")
    .required("Street is required"),
  city: Yup.string()
    .min(2, "City must be at least 2 characters")
    .required("City is required"),
  country: Yup.string()
    .min(2, "Country must be at least 2 characters")
    .required("Country is required"),
  zipCode: Yup.string()
    .min(3, "Zip code must be at least 3 characters")
    .required("Zip code is required"),
  location: Yup.string(),
  isDefault: Yup.boolean(),
});

function AddNewAddressModal({ fetchAddress }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await userService.addUserAddress({
        addressType: values.addressType,
        street: values.street,
        city: values.city,
        country: values.country,
        zipCode: values.zipCode,
        isDefault: Boolean(values.isDefault),
        location: values.location || "",
      });

      if (response.status === 201) {
        addToast({
          title: "Address added successfully",
          color: "success",
        });
        resetForm();
        onOpenChange(false);
        fetchAddress && fetchAddress();
      }
    } catch (error) {
      addToast({
        title:
          error?.data?.message || error?.data?.error || "Unable to add address",
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen}>
        Add new Address
      </Button>
      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Add New Address"
        isDismissable={false}
      >
        <Formik
          initialValues={{
            addressType: "",
            street: "",
            city: "",
            country: "Bangladesh",
            zipCode: "",
            location: "",
            isDefault: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
            errors,
            touched,
          }) => (
            <Form>
              <div className="flex flex-col gap-4">
                {/* Address Type */}
                <div>
                  <Select
                    label="Address Type"
                    placeholder="Select address type"
                    selectedKeys={
                      values.addressType
                        ? new Set([values.addressType])
                        : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      setFieldValue("addressType", selected || "");
                      setFieldTouched("addressType", true);
                    }}
                    isInvalid={touched.addressType && !!errors.addressType}
                    errorMessage={touched.addressType && errors.addressType}
                    fullWidth
                    variant="bordered"
                  >
                    {addressTypeOptions.map((option) => (
                      <SelectItem key={option.value}>{option.label}</SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Street */}
                <div>
                  <Field
                    name="street"
                    as={Input}
                    label="Street"
                    placeholder="Enter street address"
                    fullWidth
                    variant="bordered"
                  />
                  <ErrorMessage
                    name="street"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* City and Zip Code in a row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Field
                      name="city"
                      as={Input}
                      label="City"
                      placeholder="Enter city"
                      fullWidth
                      variant="bordered"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <Field
                      name="zipCode"
                      as={Input}
                      label="Zip Code"
                      placeholder="Enter zip code"
                      fullWidth
                      variant="bordered"
                    />
                    <ErrorMessage
                      name="zipCode"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <Field
                    name="country"
                    as={Input}
                    label="Country"
                    placeholder="Enter country"
                    fullWidth
                    variant="bordered"
                  />
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Location (Optional) */}
                <div>
                  <Field
                    name="location"
                    as={Input}
                    label="Location (Optional)"
                    placeholder="Enter additional location details"
                    fullWidth
                    variant="bordered"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Is Default Switch */}
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">
                    Set as default address
                  </span>
                  <Switch
                    isSelected={values.isDefault}
                    onValueChange={(isSelected) =>
                      setFieldValue("isDefault", isSelected)
                    }
                    aria-label="Toggle default address"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button
                  type="button"
                  variant="flat"
                  onPress={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CustomModal>
    </>
  );
}

export default AddNewAddressModal;
