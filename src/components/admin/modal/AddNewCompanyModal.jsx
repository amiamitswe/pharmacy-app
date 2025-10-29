import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, Select, SelectItem, addToast } from "@heroui/react";
import companyService from "../../../api-services/companyService";
import { companyAtom } from "../../../atoms/companyAtom";
import { useSetAtom } from "jotai";

const countryList = [
  { label: "Bangladesh", value: "Bangladesh" },
  { label: "India", value: "India" },
  { label: "Singapore", value: "Singapore" },
  { label: "China", value: "China" },
];

// ✅ Validation schema
const validationSchema = Yup.object({
  company: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .required("Company name is required"),
  country: Yup.string().required("Please select a country"),
});

function AddNewCompanyModal({ closeModal }) {
  const setCompanies = useSetAtom(companyAtom);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await companyService.addNewCompany({
        company: values.company,
        country: values.country,
      });

      if (response.status === 201) {
        addToast({
          title: "Company added successfully",
          color: "success",
        });
        setCompanies((pre) => ({
          ...pre,
          companies: [...pre.companies, { ...values }],
        }));
        resetForm();
        closeModal();
      }
    } catch (error) {
      addToast({
        title: error.data.error.company || error.data.message || "Unable to add company",
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ company: "", country: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            {/* Company Field */}
            <div>
              <Field
                name="company"
                as={Input}
                label="Company Name"
                placeholder="Enter company name"
                fullWidth
              />
              <ErrorMessage name="company" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <Select
                label="Select Country"
                placeholder="Choose a country"
                value={values.country}
                onChange={(e) => setFieldValue("country", e.target.value)}
                fullWidth
              >
                {countryList.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </Select>
              <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Submit Button */}
            <Button type="submit" color="primary" disabled={isSubmitting} fullWidth>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddNewCompanyModal;
