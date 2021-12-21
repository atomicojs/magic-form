import { c, useRef } from "atomico";
import { useMagicForm, MagicFormActionStatus } from "../hooks";
import { useSlot } from "@atomico/hooks/use-slot";

function magicForm() {
    const refSlot = useRef();
    const refForm = useRef();
    refForm.current = useSlot(refSlot).find(
        (el) => el instanceof HTMLFormElement
    );
    const [state, submit] = useMagicForm(refForm);
    return (
        <host state={state} submit={submit}>
            <slot ref={refSlot}></slot>
            <h1>{state?.status}</h1>
        </host>
    );
}

magicForm.props = {
    action: {
        type: String,
        reflect: true,
    },
    state: {
        type: Object,
        event: {
            type: "ChangeState",
        },
        value: (): MagicFormActionStatus => null,
    },
};

export const MagicForm = c(magicForm);
