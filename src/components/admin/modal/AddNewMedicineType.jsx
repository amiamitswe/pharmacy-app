import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, addToast, Switch } from "@heroui/react";
import { medicineTypeService } from "../../../api-services";
import { useSetAtom } from "jotai";
import { medicineTypeAtom } from "../../../atoms/medicineTypeAtom";

const validationSchema = Yup.object({
  medicineType: Yup.string()
    .trim()
    .min(2, "Too short")
    .required("Medicine type is required"),
});

function AddNewMedicineType({ closeModal }) {
  const setMedicineTypes = useSetAtom(medicineTypeAtom);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Send trimmed value to API
      const payload = { ...values, medicineType: values.medicineType.trim() };
      const response = await medicineTypeService.addNewMedicineType(payload);

      if (response?.status === 201) {
        addToast({
          title: "Medicine type added successfully",
          color: "success",
        });

        setMedicineTypes((pre) => ({
          ...pre,
          medicineTypes: [...(pre?.medicineTypes || []), payload],
          count: (pre?.count || 0) + 1,
        }));
      }

      resetForm();
      closeModal?.();
    } catch (error) {
      addToast({
        title:
          error?.data?.error?.medicineType ||
          error?.data?.message ||
          "Unable to add medicine type",
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ medicineType: "", active: false }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          <div>
            <Field
              name="medicineType"
              as={Input}
              label="Medicine Type"
              placeholder="Enter medicine type"
              fullWidth
            />
            <ErrorMessage
              name="medicineType"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">
              Type Status {values.active ? "Active" : "Inactive"}
            </span>
            <Switch
              isSelected={values.active}
              onValueChange={(isSelected) =>
                setFieldValue("active", isSelected)
              }
              aria-label="Toggle active status"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="flat" onPress={() => closeModal?.()}>
              Cancel
            </Button>
            <Button type="submit" color="primary" isLoading={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AddNewMedicineType;
