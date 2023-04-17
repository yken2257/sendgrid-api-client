/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { ApiKey } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ApiKeyUpdateFormInputValues = {
    user?: string;
    name?: string;
    value?: string;
};
export declare type ApiKeyUpdateFormValidationValues = {
    user?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    value?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ApiKeyUpdateFormOverridesProps = {
    ApiKeyUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    user?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    value?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ApiKeyUpdateFormProps = React.PropsWithChildren<{
    overrides?: ApiKeyUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    apiKey?: ApiKey;
    onSubmit?: (fields: ApiKeyUpdateFormInputValues) => ApiKeyUpdateFormInputValues;
    onSuccess?: (fields: ApiKeyUpdateFormInputValues) => void;
    onError?: (fields: ApiKeyUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ApiKeyUpdateFormInputValues) => ApiKeyUpdateFormInputValues;
    onValidate?: ApiKeyUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ApiKeyUpdateForm(props: ApiKeyUpdateFormProps): React.ReactElement;
