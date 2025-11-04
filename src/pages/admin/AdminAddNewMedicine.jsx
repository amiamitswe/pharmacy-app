import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
  Input,
  Textarea,
  Button,
  Select,
  SelectItem,
  Switch,
  addToast,
} from "@heroui/react";
import {
  companyService,
  medicineGenericService,
  medicineService,
  medicineTypeService,
} from "../../api-services";
import { useNavigate } from "react-router";

/** ------------ VALIDATION ------------------ **/
const Schema = Yup.object({
  medicineName: Yup.string().trim().min(2).required("Required"),
  originalPrice: Yup.number().typeError("Number").min(0).required("Required"),
  discount: Yup.number().typeError("Number").min(0).required("Required"),
  medicineCount: Yup.number().typeError("Number").min(0).required("Required"),
  minOrder: Yup.number().typeError("Number").min(1).required("Required"),
  maxOrder: Yup.number()
    .typeError("Number")
    .min(Yup.ref("minOrder"), "Must be ≥ Min Order")
    .required("Required"),
  description: Yup.string().trim().required("Required"),
  company: Yup.string().required("Required"),
  form: Yup.string().required("Required"),
  generics_and_strengths: Yup.array()
    .of(
      Yup.object({
        generic: Yup.string().required("Required"),
        strength: Yup.string().required("Required"),
      })
    )
    .min(1, "At least one generic/strength is required"),
});

/** ------------ COMPONENT ------------------ **/
function AdminAddNewMedicine({
  initialData = {
    medicineName: "",
    originalPrice: "",
    discount: "",
    picUrl: "",
    picUrls: [],
    medicineCount: "",
    availableStatus: true,
    minOrder: "",
    maxOrder: "",
    unit: "tablet",
    description: "",
    generics_and_strengths: [{ generic: "", strength: "" }],
    company: "",
    form: "",
    category: "", // add if you later want category
  },
}) {

  const navigate = useNavigate()
  const [singleFile, setSingleFile] = useState(null);
  const [multiFiles, setMultiFiles] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [medicineFormList, setMedicineFormList] = useState([]);
  const [medicineGenericList, setMedicineGenericList] = useState([]);


  async function uploadImages({ singleFile, multiFiles }) {
    const fd = new FormData();

    if (singleFile) fd.append("picUrl", singleFile); // optional 3rd arg: singleFile.name
    if (multiFiles && multiFiles.length) {
      Array.from(multiFiles).forEach((file) => fd.append("picUrls", file));
    }

    const res = await medicineService.uploadImages(fd);

    if (res.status !== 200) {
      throw new Error(res.data.message);
    }

    return res.data;
  }

  // ---------- Dropdown data ----------
  useEffect(() => {
    const fetchCompanyList = async () => {
      try {
        const response = await companyService.getList();
        const companies = (response?.data?.result || []).map((company) => {
          const companyName = company?.company || "";
          const countryName = company?.country || "";
          const label = countryName
            ? `${companyName} (${countryName})`
            : companyName;
          return { _id: company._id, label };
        });
        setCompanyList(companies);
      } catch (error) {
        console.error("Error fetching company list:", error);
        setCompanyList([]);
      }
    };
    fetchCompanyList();
  }, []);

  useEffect(() => {
    const fetchMedicineFormList = async () => {
      try {
        const response = await medicineTypeService.getList();
        setMedicineFormList(response?.data?.result || []);
      } catch {
        setMedicineFormList([]);
      }
    };
    fetchMedicineFormList();
  }, []);

  useEffect(() => {
    const fetchMedicineGenericList = async () => {
      try {
        const response = await medicineGenericService.getList();
        setMedicineGenericList(response?.data?.result || []);
      } catch {
        setMedicineGenericList([]);
      }
    };
    fetchMedicineGenericList();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
      <Formik
        initialValues={initialData}
        validationSchema={Schema}
        enableReinitialize={false}
        validateOnChange
        validateOnBlur
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            // 1) upload images first if any
            let uploaded = null;

            if (singleFile || (multiFiles && multiFiles.length)) {
              uploaded = await uploadImages({ singleFile, multiFiles });
              console.log("Uploaded image result:", uploaded);
            }

            // 2) build final payload
            const payload = {
              ...values,
              type: values.form,
              originalPrice: Number(values.originalPrice),
              discount: Number(values.discount),
              medicineCount: Number(values.medicineCount),
              minOrder: Number(values.minOrder),
              maxOrder: Number(values.maxOrder),
              picUrl: (uploaded && uploaded.picUrl) || values.picUrl || "",
              picUrls: (uploaded && uploaded.picUrls) || values.picUrls || [],
            };

            const result = await medicineService.saveMedicine(payload);

            if (result.status === 201) {
              addToast({
                title: "Medicine created successfully",
                description: "Saved successfully",
                color: "success",
              });
              resetForm();
              navigate("/admin/medicine");
            } else {
              throw new Error(result.data.message);
            }
          } catch (e) {
            addToast({
              title: "Unexpected error",
              description: e?.message || "Something went wrong",
              color: "danger",
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          submitCount,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          validateField,
        }) => {
          const showErr = (name) =>
            Boolean(errors?.[name]) &&
            (Boolean(touched?.[name]) || submitCount > 0);

          return (
            <Form className="space-y-4 md:space-y-6">
              {/* Two Column Grid for Main Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Medicine Name */}
                    <Field name="medicineName">
                      {() => (
                        <Input
                          label="Medicine Name"
                          value={values.medicineName}
                          onValueChange={(val) =>
                            setFieldValue("medicineName", val)
                          }
                          onBlur={() =>
                            setFieldTouched("medicineName", true, true)
                          }
                          isInvalid={showErr("medicineName")}
                          errorMessage={
                            showErr("medicineName") && errors.medicineName
                          }
                          className="w-full"
                          size="md"
                        />
                      )}
                    </Field>

                    {/* Original Price */}
                    <Field name="originalPrice">
                      {() => (
                        <Input
                          label="Original Price"
                          type="number"
                          value={String(values.originalPrice ?? "")}
                          onValueChange={(val) =>
                            setFieldValue("originalPrice", val)
                          }
                          onBlur={() =>
                            setFieldTouched("originalPrice", true, true)
                          }
                          isInvalid={showErr("originalPrice")}
                          errorMessage={
                            showErr("originalPrice") && errors.originalPrice
                          }
                          size="md"
                        />
                      )}
                    </Field>

                    {/* Discount */}
                    <Field name="discount">
                      {() => (
                        <Input
                          label="Discount"
                          type="number"
                          value={String(values.discount ?? "")}
                          onValueChange={(val) =>
                            setFieldValue("discount", val)
                          }
                          onBlur={() => setFieldTouched("discount", true, true)}
                          isInvalid={showErr("discount")}
                          errorMessage={showErr("discount") && errors.discount}
                          size="md"
                        />
                      )}
                    </Field>

                    {/* Stock Count */}
                    <Field name="medicineCount">
                      {() => (
                        <Input
                          label="Stock Count"
                          type="number"
                          value={String(values.medicineCount ?? "")}
                          onValueChange={(val) =>
                            setFieldValue("medicineCount", val)
                          }
                          onBlur={() =>
                            setFieldTouched("medicineCount", true, true)
                          }
                          isInvalid={showErr("medicineCount")}
                          errorMessage={
                            showErr("medicineCount") && errors.medicineCount
                          }
                          size="md"
                        />
                      )}
                    </Field>

                    {/* Min Order */}
                    <Field name="minOrder">
                      {() => (
                        <Input
                          label="Min Order"
                          type="number"
                          value={String(values.minOrder ?? "")}
                          onValueChange={(val) =>
                            setFieldValue("minOrder", val)
                          }
                          onBlur={() => setFieldTouched("minOrder", true, true)}
                          isInvalid={showErr("minOrder")}
                          errorMessage={showErr("minOrder") && errors.minOrder}
                          size="md"
                        />
                      )}
                    </Field>

                    {/* Max Order */}
                    <Field name="maxOrder">
                      {() => (
                        <Input
                          label="Max Order"
                          type="number"
                          value={String(values.maxOrder ?? "")}
                          onValueChange={(val) =>
                            setFieldValue("maxOrder", val)
                          }
                          onBlur={() => setFieldTouched("maxOrder", true, true)}
                          isInvalid={showErr("maxOrder")}
                          errorMessage={showErr("maxOrder") && errors.maxOrder}
                          size="md"
                        />
                      )}
                    </Field>
                  </div>

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-default-200 dark:border-default-100 p-3">
                      <label className="text-sm font-medium block mb-2">
                        Picture (single)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setSingleFile(e.target.files?.[0] || null)
                        }
                        className="w-full text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-default-100 file:text-default-700 hover:file:bg-default-200"
                      />
                      {singleFile && (
                        <p className="text-xs text-default-500 mt-2 truncate">
                          {singleFile.name}
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg border border-default-200 dark:border-default-100 p-3">
                      <label className="text-sm font-medium block mb-2">
                        Pictures (multiple)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setMultiFiles(e.target.files || [])}
                        className="w-full text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-default-100 file:text-default-700 hover:file:bg-default-200"
                      />
                      {multiFiles.length > 0 && (
                        <p className="text-xs text-default-500 mt-2">
                          {multiFiles.length} file(s) selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Company & Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field name="company">
                      {() => (
                        <Select
                          label="Company"
                          selectedKeys={
                            values.company
                              ? new Set([String(values.company)])
                              : new Set()
                          }
                          onSelectionChange={(keys) => {
                            const selectedId = Array.from(keys)[0];
                            setFieldValue("company", selectedId || "");
                            setFieldTouched("company", true, true);
                            validateField("company");
                          }}
                          isInvalid={showErr("company")}
                          errorMessage={showErr("company") && errors.company}
                          size="md"
                          placeholder="Select a company"
                        >
                          {companyList.map((opt) => (
                            <SelectItem key={String(opt._id)}>
                              {opt.label || "Unknown Company"}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    </Field>

                    <Field name="form">
                      {() => (
                        <Select
                          label="Medicine Form"
                          selectedKeys={
                            values.form
                              ? new Set([String(values.form)])
                              : new Set()
                          }
                          onSelectionChange={(keys) => {
                            const selectedId = Array.from(keys)[0];
                            setFieldValue("form", selectedId || "");
                            setFieldTouched("form", true, true);
                            validateField("form");
                          }}
                          isInvalid={showErr("form")}
                          errorMessage={showErr("form") && errors.form}
                          size="md"
                          placeholder="Select a medicine form"
                        >
                          {medicineFormList.map((opt) => (
                            <SelectItem key={String(opt._id)}>
                              {opt.medicineType}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    </Field>
                  </div>

                  {/* Description */}
                  <Field name="description">
                    {() => (
                      <Textarea
                        label="Description"
                        minRows={6}
                        value={values.description}
                        onValueChange={(val) =>
                          setFieldValue("description", val)
                        }
                        onBlur={() =>
                          setFieldTouched("description", true, true)
                        }
                        isInvalid={showErr("description")}
                        errorMessage={
                          showErr("description") && errors.description
                        }
                        size="md"
                        className="w-full"
                      />
                    )}
                  </Field>

                  {/* Available Status */}
                  <Field name="availableStatus">
                    {() => (
                      <div className="flex items-center justify-between rounded-lg border border-default-200 dark:border-default-100 px-4 py-3">
                        <span className="text-sm font-medium">
                          Available Status
                        </span>
                        <Switch
                          isSelected={values.availableStatus}
                          onValueChange={(v) =>
                            setFieldValue("availableStatus", v)
                          }
                        />
                      </div>
                    )}
                  </Field>
                </div>
              </div>

              {/* Generics & Strengths */}
              <div className="w-full">
                <div className="rounded-lg border border-default-200 dark:border-default-100 p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <h3 className="text-base font-semibold">
                      Generics & Strengths
                    </h3>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() =>
                        setFieldValue("generics_and_strengths", [
                          ...values.generics_and_strengths,
                          { generic: "", strength: "" },
                        ])
                      }
                    >
                      Add New
                    </Button>
                  </div>

                  <FieldArray name="generics_and_strengths">
                    {({ remove }) => (
                      <div className="space-y-4">
                        {values.generics_and_strengths.map((row, idx) => {
                          const selectedGeneric = medicineGenericList.find(
                            (g) => g._id === row.generic
                          );
                          const availableStrengths =
                            selectedGeneric?.strength || [];
                          const rowErr =
                            Array.isArray(errors.generics_and_strengths) &&
                            errors.generics_and_strengths[idx];

                          return (
                            <div
                              key={idx}
                              className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start p-3 rounded-lg bg-default-50 dark:bg-default-100"
                            >
                              <div className="sm:col-span-5">
                                <Select
                                  label="Generic"
                                  selectedKeys={
                                    row.generic
                                      ? new Set([String(row.generic)])
                                      : new Set()
                                  }
                                  onSelectionChange={(keys) => {
                                    const selectedGenericId =
                                      Array.from(keys)[0] || "";
                                    setFieldValue(
                                      `generics_and_strengths.${idx}.generic`,
                                      selectedGenericId
                                    );
                                    setFieldTouched(
                                      `generics_and_strengths.${idx}.generic`,
                                      true,
                                      true
                                    );
                                    validateField(
                                      `generics_and_strengths.${idx}.generic`
                                    );
                                    setFieldValue(
                                      `generics_and_strengths.${idx}.strength`,
                                      ""
                                    );
                                  }}
                                  isInvalid={
                                    submitCount > 0 &&
                                    Boolean(rowErr && rowErr.generic)
                                  }
                                  errorMessage={
                                    submitCount > 0 && rowErr && rowErr.generic
                                  }
                                  size="md"
                                  className="w-full"
                                  placeholder="Select a generic"
                                >
                                  {medicineGenericList.map((opt) => (
                                    <SelectItem key={String(opt._id)}>
                                      {opt.genericName}
                                    </SelectItem>
                                  ))}
                                </Select>
                              </div>

                              <div className="sm:col-span-4">
                                <Select
                                  label="Strength"
                                  selectedKeys={
                                    row.strength
                                      ? new Set([String(row.strength)])
                                      : new Set()
                                  }
                                  onSelectionChange={(keys) => {
                                    const selectedStrength =
                                      Array.from(keys)[0] || "";
                                    setFieldValue(
                                      `generics_and_strengths.${idx}.strength`,
                                      selectedStrength
                                    );
                                    setFieldTouched(
                                      `generics_and_strengths.${idx}.strength`,
                                      true,
                                      true
                                    );
                                    validateField(
                                      `generics_and_strengths.${idx}.strength`
                                    );
                                  }}
                                  isInvalid={
                                    submitCount > 0 &&
                                    Boolean(rowErr && rowErr.strength)
                                  }
                                  errorMessage={
                                    submitCount > 0 && rowErr && rowErr.strength
                                  }
                                  size="md"
                                  className="w-full"
                                  placeholder="Select a strength"
                                  isDisabled={
                                    !row.generic ||
                                    availableStrengths.length === 0
                                  }
                                >
                                  {availableStrengths.map((st) => (
                                    <SelectItem key={String(st)}>
                                      {st}
                                    </SelectItem>
                                  ))}
                                </Select>
                              </div>

                              <div className="sm:col-span-3 flex items-end">
                                <Button
                                  color="danger"
                                  variant="flat"
                                  onPress={() => remove(idx)}
                                  size="md"
                                  className="w-full sm:w-auto"
                                  isDisabled={
                                    values.generics_and_strengths.length === 1
                                  }
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </FieldArray>

                  {typeof errors.generics_and_strengths === "string" && (
                    <p className="text-danger text-sm mt-3">
                      {errors.generics_and_strengths}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-default-200 dark:border-default-100">
                <Button
                  type="reset"
                  variant="flat"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  color="primary"
                  isLoading={isSubmitting}
                  size="md"
                  className="w-full sm:w-auto"
                >
                  Save Medicine
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default AdminAddNewMedicine;
