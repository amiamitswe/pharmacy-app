import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, Select, SelectItem, addToast } from "@heroui/react";
import { useSetAtom } from "jotai";
import { mCategoryService } from "../../../api-services";
import { mCategoryAtom } from "../../../atoms/mCategoryAtom";

const validationSchema = Yup.object({
  categoryName: Yup.string()
    .min(2, "Category name must be at least 2 characters")
    .required("Category name is required"),
  details: Yup.string()
    .min(10, "Details must be at least 10 characters")
    .required("Details is required"),
});

function AddNewCategory({ closeModal }) {
  const setMCategories = useSetAtom(mCategoryAtom);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await mCategoryService.addNewCategory({
        categoryName: values.categoryName,
        details: values.details,
      });

      if (response.status === 201) {
        addToast({
          title: "Category added successfully",
          color: "success",
        });
        setMCategories((pre) => ({
          ...pre,
          categories: [...pre.categories, { ...values }],
          count: pre.count + 1,
        }));
        resetForm();
        closeModal?.();
      }
    } catch (error) {
      addToast({
        title:
          error.data.error.categoryName ||
          error.data.message ||
          "Unable to add new category",
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ categoryName: "", details: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <Field
                name="categoryName"
                as={Input}
                label="Category Name"
                placeholder="Enter category name"
                fullWidth
              />
              <ErrorMessage
                name="categoryName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <Field
                name="details"
                as={Input}
                label="Category Details"
                placeholder="Enter details"
                fullWidth
              />
              <ErrorMessage
                name="details"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                variant="flat"
                onPress={() => closeModal?.()}
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
    </div>
  );
}

export default AddNewCategory;
