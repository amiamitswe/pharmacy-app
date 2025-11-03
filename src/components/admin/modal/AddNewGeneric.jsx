import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, addToast, Select, SelectItem } from "@heroui/react";
import TagInput from "../../common/TagInput";
import {
  medicineGenericService,
  medicineTypeService,
} from "../../../api-services";
import { useAtom, useSetAtom } from "jotai";
import { medicineGenericAtom } from "../../../atoms/medicineGenericAtom";
import { medicineTypeAtom } from "../../../atoms/medicineTypeAtom";

const validationSchema = Yup.object({
  genericName: Yup.string()
    .trim()
    .min(2, "Too short")
    .required("Generic name is required"),
  strength: Yup.array()
    .of(Yup.string().trim().min(1))
    .min(1, "Add at least one strength")
    .required("Add at least one strength"),
  medicine_forms: Yup.mixed()
    .test("is-not-empty", "Select at least one medicine type", (value) => {
      if (value instanceof Set) {
        return value.size > 0;
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return false;
    })
    .required("Medicine type is required"),
});

function AddNewGeneric({ closeModal }) {
  const setMGenerics = useSetAtom(medicineGenericAtom);
  const [medicineTypesState, setMedicineTypesState] = useAtom(medicineTypeAtom);
  const [loadingTypes, setLoadingTypes] = useState(false);

  useEffect(() => {
    const fetchMedicineTypes = async () => {
      try {
        setLoadingTypes(true);
        const response = await medicineTypeService.getList();
        if (response?.status === 200) {
          setMedicineTypesState((pre) => ({
            ...pre,
            medicineTypes: response?.data?.result,
            loading: false,
            error: null,
            count: response?.data?.dataCount,
          }));
        }
      } catch (error) {
        addToast({
          title: error?.data?.message || "Failed to fetch medicine types",
          color: "danger",
        });
      } finally {
        setLoadingTypes(false);
      }
    };

    if (medicineTypesState?.medicineTypes?.length === 0) {
      fetchMedicineTypes();
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        genericName: values.genericName.trim(),
        strength: values.strength.map((s) => s.trim()).filter(Boolean),
        medicine_forms: Array.isArray(values.medicine_forms)
          ? values.medicine_forms
          : Array.from(values.medicine_forms || []),
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
      initialValues={{
        genericName: "",
        strength: [],
        medicineType: new Set([]),
      }}
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

          <div>
            <Select
              label="Medicine Type"
              placeholder="Select medicine types"
              selectedKeys={values.medicine_forms}
              selectionMode="multiple"
              onSelectionChange={(keys) => {
                setFieldValue("medicine_forms", keys);
              }}
              isLoading={loadingTypes}
              fullWidth
            >
              {medicineTypesState.medicineTypes.map((type) => (
                <SelectItem key={type.medicineType}>
                  {type.medicineType}
                </SelectItem>
              ))}
            </Select>
            <ErrorMessage
              name="medicine_forms"
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
