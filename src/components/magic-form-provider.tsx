import { c, Props, useHost } from "atomico";
import { useMagicFormProvider, MagicFormsActions, MagicForms } from "../hooks";

function FormProvider(props: Props<typeof FormProvider.props>) {
    const host = useHost();
    const forms = useMagicFormProvider(host, props.actions);
    return <host forms={Object.keys(forms).length ? forms : null}></host>;
}

FormProvider.props = {
    actions: {
        type: Object,
        value: (): MagicFormsActions => ({}),
    },
    forms: {
        type: Object,
        event: {
            type: "ChangeForms",
        },
        value: (): MagicForms => ({}),
    },
};

export const MagicFormProvider = c(FormProvider);
