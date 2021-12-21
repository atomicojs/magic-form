import { useEvent, Ref, useState, DOMEvent } from "atomico";
import { useListener } from "@atomico/hooks/use-listener";

export enum MagicFormStatus {
    pending = "pending",
    fulfilled = "fulfilled",
    rejected = "rejected",
}

export type MagicFormKeyStatus =
    | MagicFormStatus.pending
    | MagicFormStatus.fulfilled
    | MagicFormStatus.rejected;

export interface MagicFormDetail {
    action: string;
    target: HTMLFormElement;
    observe(state: MagicFormActionStatus): void;
}

export interface MagicFormsActions {
    [action: string]: Action;
}

export interface MagicFormActionStatus {
    result?: any;
    status: MagicFormKeyStatus;
}

export type Action = (form: HTMLFormElement) => Promise<any>;

export const eventTypeMagicFormSubmit = "MagicFormSubmit";

/**
 * Capture the submit event and send it to the provider so that it can be resolved
 */
export function useMagicForm(
    ref: Ref<HTMLFormElement>,
    options?: { action?: string }
) {
    const [state, setState] = useState<MagicFormActionStatus>();

    const dispatchSubmit = useEvent<MagicFormDetail>(eventTypeMagicFormSubmit, {
        bubbles: true,
        composed: true,
    });

    const submit = (event?: DOMEvent<"submit">) => {
        if (event) {
            event.preventDefault();
        }
        const target = (event?.target || ref.current) as HTMLFormElement;
        dispatchSubmit({
            target,
            action:
                options?.action ||
                ref.current.getAttribute("action") ||
                target.getAttribute("action"),
            observe: setState,
        });
    };

    useListener(ref, "submit", submit);

    const res: [MagicFormActionStatus, () => void] = [state, submit];
    return res;
}

/**
 * Resolves requests sent by useMagicForm
 */
export function useMagicFormProvider(ref: Ref, actions: MagicFormsActions) {
    const [forms, setForms] = useState<{
        [action: string]: Map<HTMLFormElement, MagicFormActionStatus>;
    }>({});

    useListener(
        ref,
        eventTypeMagicFormSubmit,
        (event: CustomEvent<MagicFormDetail>) => {
            const {
                detail: { action, target, observe },
            } = event;

            setForms((forms) => {
                if (!forms[action]) {
                    forms = {
                        ...forms,
                        [action]: new Map(),
                    };
                }

                const prev = forms[action].get(target);

                if (!prev || prev.status != MagicFormStatus.pending) {
                    let nextForms = new Map(forms[action]);
                    let current: MagicFormActionStatus = {
                        status: MagicFormStatus.pending,
                    };

                    nextForms.set(target, current);

                    observe(current);

                    const update = (current: MagicFormActionStatus) => {
                        setForms((forms) => ({
                            ...forms,
                            [action]: new Map(forms[action]).set(
                                target,
                                current
                            ),
                        }));
                        observe(current);
                    };
                    // the listening process will generate an update on the same state once the promise is resolved
                    actions[action](target)
                        .then((result) =>
                            update({
                                result,
                                status: MagicFormStatus.fulfilled,
                            })
                        )
                        .catch((result) =>
                            update({
                                result,
                                status: MagicFormStatus.rejected,
                            })
                        );
                    // create a new object to force update
                    forms = {
                        ...forms,
                        [action]: nextForms,
                    };
                }

                return forms;
            });
        }
    );

    return forms;
}
