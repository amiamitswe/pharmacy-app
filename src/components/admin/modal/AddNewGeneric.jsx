import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, addToast } from "@heroui/react";
import TagInput from "../../common/TagInput";
import { medicineGenericService } from "../../../api-services";
import { useSetAtom } from "jotai";
import { medicineGenericAtom } from "../../../atoms/medicineGenericAtom";

const validationSchema = Yup.object({
  genericName: Yup.string()
    .trim()
    .min(2, "Too short")
    .required("Generic name is required"),
  strength: Yup.array()
    .of(Yup.string().trim().min(1))
    .min(1, "Add at least one strength")
    .required("Add at least one strength"),
});

function AddNewGeneric({ closeModal }) {
  const setMGenerics = useSetAtom(medicineGenericAtom);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        genericName: values.genericName.trim(),
        strength: values.strength.map((s) => s.trim()).filter(Boolean),
      };

      const response = await medicineGenericService.addNewGeneric(payload);

      if (response.status === 201) {
        addToast({ title: "Generic added successfully", color: "success" });

        setMGenerics((pre) => ({
          ...pre,
          generics: [...(pre?.generics || []), payload],
          count: (pre?.count || 0) + 1,
        }));

        resetForm();
        closeModal?.();
      }
    } catch (error) {
      addToast({
        title:
          error?.data?.error?.genericName ||
          error?.data?.message ||
          "Failed to add generic",
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ genericName: "", strength: [] }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          <div>
            <Field
              name="genericName"
              as={Input}
              label="Generic Name"
              placeholder="Enter generic name"
              fullWidth
            />
            <ErrorMessage
              name="genericName"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <TagInput
              label="Strength"
              value={values.strength}
              onChange={(tags) => setFieldValue("strength", tags)}
              placeholder="e.g., 250mg, 500mg"
            />
            <ErrorMessage
              name="strength"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="flat" onPress={() => closeModal?.()}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AddNewGeneric;
