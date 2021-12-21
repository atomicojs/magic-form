import { c, Props, useHost } from "atomico";
import { useMagicFormProvider, MagicFormsActions } from "../hooks";

function FormProvider({ actions }: Props<typeof FormProvider.props>) {
    const host = useHost();
    const forms = useMagicFormProvider(host, actions);
    return <host forms={Object.keys(forms).length ? forms : null}></host>;
}

FormProvider.props = {
    age: Number,
    actions: {
        type: Object,
        value: (): MagicFormsActions => ({}),
    },
    forms: {
        type: Object,
        event: {
            type: "ChangeStatus",
        },
    },
};

type S = Props<typeof FormProvider.props>;

export const MagicFormProvider = c(FormProvider);
