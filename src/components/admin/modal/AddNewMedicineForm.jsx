import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, addToast, Switch } from "@heroui/react";
import { medicineFormService } from "../../../api-services";
import { useSetAtom } from "jotai";
import { medicineFormAtom } from "../../../atoms/medicineFormAtom";

const validationSchema = Yup.object({
  medicineForm: Yup.string()
    .trim()
    .min(2, "Too short")
    .required("Medicine form is required"),
});

function AddNewMedicineForm({ closeModal }) {
  const setMedicineTypes = useSetAtom(medicineFormAtom);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Send trimmed value to API
      const payload = { ...values, medicineForm: values.medicineForm.trim() };
      const response = await medicineFormService.addNewMedicineType(payload);

      if (response?.status === 201) {
        addToast({
          title: "Medicine form added successfully",
          color: "success",
        });

        setMedicineTypes((pre) => ({
          ...pre,
          medicineForms: [...(pre?.medicineForms || []), payload],
          count: (pre?.count || 0) + 1,
        }));
      }

      resetForm();
      closeModal?.();
    } catch (error) {
      addToast({
        title:
          error?.data?.error?.medicineForm ||
          error?.data?.message ||
          "Unable to add medicine form",
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ medicineForm: "", active: false }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          <div>
            <Field
              name="medicineForm"
              as={Input}
              label="Medicine Form"
              placeholder="Enter medicine form"
              fullWidth
            />
            <ErrorMessage
              name="medicineForm"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">
              Form Status {values.active ? "Active" : "Inactive"}
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

export default AddNewMedicineForm;
