import { c, useRef, useHost } from "atomico";
import { useMagicForm, MagicFormActionStatus, MagicFormStatus } from "../hooks";
import { useSlot } from "@atomico/hooks/use-slot";

function magicForm() {
    const host = useHost();
    const refSlot = useRef();
    const refForm = useRef();
    refForm.current = useSlot(refSlot).find(
        (el) => el instanceof HTMLFormElement
    );
    const [state, submit] = useMagicForm(refForm);
    return (
        <host shadowDom state={state} submit={submit}>
            <slot ref={refSlot}></slot>
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
        value: (): MagicFormActionStatus => ({
            status: MagicFormStatus.quiet,
            result: null,
        }),
    },
};

export const MagicForm = c(magicForm);
