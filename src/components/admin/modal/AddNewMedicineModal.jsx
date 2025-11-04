// import React from 'react'

// function AddNewMedicineModal() {
//   return (
//     <div>AddNewMedicineModal</div>
//   )
// }

// export default AddNewMedicineModal



import React, { useState } from "react";
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

/** ------------ API SERVICES (replace endpoints) ----------- **/
async function uploadImagesApi({ picFile, picFiles }) {
  const fd = new FormData();
  if (picFile) fd.append("picUrl", picFile);
  if (picFiles && picFiles.length) {
    [...picFiles].forEach((file) => fd.append("picUrls", file));
  }

  const res = await fetch("/api/uploads/medicine-images", {
    method: "POST",
    body: fd,
    // no headers — FormData sets its own boundary
    credentials: "include",
  });

  // Expected response shape:
  // { picUrl: "https://.../single.jpg", picUrls: ["https://.../a.jpg", "..."] }
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

async function createMedicineApi(payload) {
  const res = await fetch("/api/medicines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

/** ------------ VALIDATION ------------------ **/
const Schema = Yup.object({
  medicineName: Yup.string().trim().min(2).required("Required"),
  strength: Yup.string().trim().required("Required"),
  originalPrice: Yup.number().typeError("Number").min(0).required("Required"),
  discount: Yup.number().typeError("Number").min(0).required("Required"),
  medicineCount: Yup.number().typeError("Number").min(0).required("Required"),
  minOrder: Yup.number().typeError("Number").min(1).required("Required"),
  maxOrder: Yup.number()
    .typeError("Number")
    .min(Yup.ref("minOrder"), "Must be ≥ Min Order")
    .required("Required"),
  unit: Yup.string().trim().required("Required"),
  description: Yup.string().trim().required("Required"),
  company: Yup.string().required("Required"),
  generic: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  type: Yup.string().required("Required"),
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
export default function MedicineForm({
  // Pass arrays like: [{ _id: "68c94b93e2b29f7b130f876f", name: "Fexofenadine" }, ...]
  genericOptions = [],
  companyOptions = [],
  categoryOptions = [],
  typeOptions = [],
  // Optional: default initial JSON
  initialData = {
    medicineName: "Telfast 200",
    strength: "200mg",
    originalPrice: 10,
    discount: 4,
    picUrl: "",
    picUrls: [""],
    medicineCount: 100,
    availableStatus: true,
    minOrder: 1,
    maxOrder: 10,
    unit: "tablet",
    description:
      "Fenadin 120 180mg Tablet should only be used during pregnancy when the benefits of treatment outweigh the risks. Before prescribing Fenadin 180 180mg Tablet Please consult your doctor.",
    generics_and_strengths: [
      { generic: "68c94b93e2b29f7b130f876f", strength: "200mg" },
    ],
    company: "68c94bbde2b29f7b130f8772",
    generic: "68c94b93e2b29f7b130f876f",
    category: "68c94c26e2b29f7b130f8777",
    type: "68c94a96e2b29f7b130f8754",
  },
}) {
  const [singleFile, setSingleFile] = useState(null);
  const [multiFiles, setMultiFiles] = useState([]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formik
        validateOnBlur
        validateOnChange={false}
        initialValues={initialData}
        validationSchema={Schema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            // 1) Upload images first
            const { ok, status, data } = await uploadImagesApi({
              picFile: singleFile,
              picFiles: multiFiles,
            });

            if (!ok) {
              addToast({
                title: `Upload failed (${status})`,
                description: data?.message || "Could not upload images",
                color: "danger",
              });
              return;
            }

            // 2) Build JSON payload (merge returned URLs)
            const payload = {
              medicineName: values.medicineName.trim(),
              strength: values.strength.trim(),
              originalPrice: Number(values.originalPrice),
              discount: Number(values.discount),
              picUrl: data?.picUrl || "", // from upload API
              picUrls: Array.isArray(data?.picUrls) ? data.picUrls : [],
              medicineCount: Number(values.medicineCount),
              availableStatus: Boolean(values.availableStatus),
              minOrder: Number(values.minOrder),
              maxOrder: Number(values.maxOrder),
              unit: values.unit.trim(),
              description: values.description.trim(),
              generics_and_strengths: values.generics_and_strengths.map((g) => ({
                generic: g.generic,
                strength: g.strength.trim(),
              })),
              company: values.company,
              generic: values.generic,
              category: values.category,
              type: values.type,
            };

            // 3) Create medicine
            const createRes = await createMedicineApi(payload);

            if (createRes.ok) {
              addToast({
                title: "Medicine created",
                description: "Saved successfully",
                color: "success",
              });
              resetForm();
              setSingleFile(null);
              setMultiFiles([]);
            } else {
              addToast({
                title: `Create failed (${createRes.status})`,
                description:
                  createRes?.data?.message || "Could not create medicine",
                color: "danger",
              });
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
        {({ values, errors, isSubmitting, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-4">
              <Field name="medicineName">
                {({ field, meta }) => (
                  <Input
                    label="Medicine Name"
                    {...field}
                    isInvalid={!!meta.error && meta.touched}
                    errorMessage={meta.touched && meta.error}
                    className="w-full"
                  />
                )}
              </Field>

              <Field name="strength">
                {({ field, meta }) => (
                  <Input
                    label="Strength"
                    placeholder="e.g., 200mg"
                    {...field}
                    isInvalid={!!meta.error && meta.touched}
                    errorMessage={meta.touched && meta.error}
                    className="w-full"
                  />
                )}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field name="originalPrice">
                  {({ field, meta }) => (
                    <Input
                      label="Original Price"
                      type="number"
                      {...field}
                      isInvalid={!!meta.error && meta.touched}
                      errorMessage={meta.touched && meta.error}
                    />
                  )}
                </Field>

                <Field name="discount">
                  {({ field, meta }) => (
                    <Input
                      label="Discount"
                      type="number"
                      {...field}
                      isInvalid={!!meta.error && meta.touched}
                      errorMessage={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </div>

              <Field name="medicineCount">
                {({ field, meta }) => (
                  <Input
                    label="Stock Count"
                    type="number"
                    {...field}
                    isInvalid={!!meta.error && meta.touched}
                    errorMessage={meta.touched && meta.error}
                  />
                )}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field name="minOrder">
                  {({ field, meta }) => (
                    <Input
                      label="Min Order"
                      type="number"
                      {...field}
                      isInvalid={!!meta.error && meta.touched}
                      errorMessage={meta.touched && meta.error}
                    />
                  )}
                </Field>

                <Field name="maxOrder">
                  {({ field, meta }) => (
                    <Input
                      label="Max Order"
                      type="number"
                      {...field}
                      isInvalid={!!meta.error && meta.touched}
                      errorMessage={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </div>

              <Field name="unit">
                {({ field, meta }) => (
                  <Input
                    label="Unit"
                    placeholder="tablet, syrup, etc."
                    {...field}
                    isInvalid={!!meta.error && meta.touched}
                    errorMessage={meta.touched && meta.error}
                  />
                )}
              </Field>

              <Field name="availableStatus">
                {({ field }) => (
                  <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                    <span className="text-sm">Available</span>
                    <Switch
                      isSelected={field.value}
                      onValueChange={(v) => setFieldValue("availableStatus", v)}
                    />
                  </div>
                )}
              </Field>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Single image */}
              <div className="rounded-xl border p-3">
                <label className="text-sm block mb-1">Picture (single)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSingleFile(e.target.files?.[0] || null)}
                />
              </div>

              {/* Multiple images */}
              <div className="rounded-xl border p-3">
                <label className="text-sm block mb-1">Pictures (multiple)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setMultiFiles(e.target.files || [])}
                />
              </div>

              {/* Company */}
              <Field name="company">
                {({ field, meta }) => (
                  <Select
                    label="Company"
                    selectedKeys={new Set([field.value])}
                    onSelectionChange={(keys) =>
                      setFieldValue("company", Array.from(keys)[0])
                    }
                    isInvalid={!!meta.error && meta.touched}
                    errorMessage={meta.touched && meta.error}
                  >
                    {companyOptions.map((opt) => (
                      <SelectItem key={opt._id} value={opt._id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </Field>

              {/* Generic */}
              <Field name="generic">
                {({ field, meta }) => (
                  <Select
                    label="Generic"
                    selectedKeys={new Set([field.value])}
                    onSelectionChange={(keys) =>
                      setFieldValue("generic", Array.from(keys)[0])
                    }
                    isInvalid={!!meta.error && meta.touched}
                    errorMessage={meta.touched && meta.error}
                  >
                    {genericOptions.map((opt) => (
                      <SelectItem key={opt._id} value={opt._id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </Field>

              {/* Category */}
              <Field name="category">
                {({ field, meta }) => (
                  <Select
                    label="Category"
                    selectedKeys={new Set([field.value])}
                    onSelectionChange={(keys) =>
                      setFieldValue("category", Array.from(keys)[0])
                    }
                    isInvalid={!!meta.error && meta.touched}
                    errorMessage={meta.touched && meta.error}
                  >
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt._id} value={opt._id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </Field>

              {/* Type */}
              <Field name="type">
                {({ field, meta }) => (
                  <Select
                    label="Type"
                    selectedKeys={new Set([field.value])}
                    onSelectionChange={(keys) =>
                      setFieldValue("type", Array.from(keys)[0])
                    }
                    isInvalid={!!meta.error && meta.touched}
                    errorMessage={meta.touched && meta.error}
                  >
                    {typeOptions.map((opt) => (
                      <SelectItem key={opt._id} value={opt._id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </Field>

              <Field name="description">
                {({ field, meta }) => (
                  <Textarea
                    label="Description"
                    minRows={4}
                    {...field}
                    isInvalid={!!meta.error && meta.touched}
                    errorMessage={meta.touched && meta.error}
                  />
                )}
              </Field>
            </div>

            {/* Full width: generics_and_strengths builder */}
            <div className="md:col-span-2">
              <div className="rounded-2xl border p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Generics & Strengths</h3>
                  <Button
                    size="sm"
                    onPress={() =>
                      setFieldValue("generics_and_strengths", [
                        ...values.generics_and_strengths,
                        { generic: "", strength: "" },
                      ])
                    }
                  >
                    Add
                  </Button>
                </div>

                <FieldArray name="generics_and_strengths">
                  {({ remove }) => (
                    <div className="space-y-3">
                      {values.generics_and_strengths.map((row, idx) => {
                        const gErr =
                          errors.generics_and_strengths?.[idx] || {};
                        return (
                          <div
                            key={idx}
                            className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start"
                          >
                            <Select
                              label="Generic"
                              selectedKeys={new Set([row.generic])}
                              onSelectionChange={(keys) =>
                                setFieldValue(
                                  `generics_and_strengths.${idx}.generic`,
                                  Array.from(keys)[0]
                                )
                              }
                              isInvalid={!!gErr?.generic}
                              errorMessage={gErr?.generic}
                            >
                              {genericOptions.map((opt) => (
                                <SelectItem key={opt._id} value={opt._id}>
                                  {opt.name}
                                </SelectItem>
                              ))}
                            </Select>

                            <Input
                              label="Strength"
                              value={row.strength}
                              onChange={(e) =>
                                setFieldValue(
                                  `generics_and_strengths.${idx}.strength`,
                                  e.target.value
                                )
                              }
                              isInvalid={!!gErr?.strength}
                              errorMessage={gErr?.strength}
                            />

                            <div className="flex gap-2">
                              <Button
                                color="danger"
                                variant="flat"
                                onPress={() => remove(idx)}
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
                  <p className="text-danger text-sm mt-2">
                    {errors.generics_and_strengths}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <Button type="reset" variant="flat">
                Reset
              </Button>
              <Button type="submit" color="secondary" isLoading={isSubmitting}>
                Save Medicine
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
