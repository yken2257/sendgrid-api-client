/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ApiKeyCreateFormInputValues = {
    user?: string;
    name?: string;
    value?: string;
};
export declare type ApiKeyCreateFormValidationValues = {
    user?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    value?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ApiKeyCreateFormOverridesProps = {
    ApiKeyCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    user?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    value?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ApiKeyCreateFormProps = React.PropsWithChildren<{
    overrides?: ApiKeyCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ApiKeyCreateFormInputValues) => ApiKeyCreateFormInputValues;
    onSuccess?: (fields: ApiKeyCreateFormInputValues) => void;
    onError?: (fields: ApiKeyCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ApiKeyCreateFormInputValues) => ApiKeyCreateFormInputValues;
    onValidate?: ApiKeyCreateFormValidationValues;
} & React.CSSProperties>;
export default function ApiKeyCreateForm(props: ApiKeyCreateFormProps): React.ReactElement;
