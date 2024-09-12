"use client";
import React, { useReducer } from 'react';
import { useFormik, FormikConfig } from 'formik';
import { FormContextProvider } from './FormContext';

interface Props extends Omit<FormikConfig<any>, 'validateOnMount' | 'validateOnChange'> {
  children: (props: any) => React.ReactNode;
  handleIsSubmitting?: any;
  handleIsValidating?: any;
  name?: string;
  id?: string;
}

function errorReducer(state: any, action: any) {
  if (!action.error) {
    const payload = { ...state };
    delete payload[action.key];
    return payload;
  }
  if (action) {
    return {
      ...state,
      [action.key]: action.error,
    };
  } else {
    throw new Error();
  }
}

export const Form =  function({ validate, ...props }: Props) {
  const [fieldLevelErrors, dispatchErrors] = useReducer(errorReducer, {});

  function handleFieldLevelValidation(key: any, error: string) {
    dispatchErrors({ key, error });
  }

  const formik = useFormik({
    validateOnBlur: true,
    ...props,
    validationSchema: props.validationSchema,
    initialValues: props.initialValues,
    onSubmit: props.onSubmit,
    validate:
      validate ||
      function () {
        return fieldLevelErrors;
      },
  });

  return (
    <form id={props.id} name={props.name} onSubmit={formik.handleSubmit}>
      <FormContextProvider
        values={formik.values}
        errors={formik.errors}
        formContextOnChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        touched={formik.touched}
        fieldLevelValidation={handleFieldLevelValidation}
      >
        {props.children({
          errors: formik.errors,
          touched: formik.touched,
          isSubmitting: formik.isSubmitting,
          isValidating: formik.isValidating,
          submitCount: formik.submitCount,
          handleReset: formik.handleReset,
          values: formik.values,
        })}
      </FormContextProvider>
    </form>
  );
}