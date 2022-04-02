import { useEvent, Ref, useState, DOMEvent } from "atomico";
import { useListener } from "@atomico/hooks/use-listener";

export type MagicFormSubmitter = HTMLButtonElement | HTMLInputElement;

export enum MagicFormStatus {
    quiet = "",
    pending = "pending",
    fulfilled = "fulfilled",
    rejected = "rejected",
}

export type MagicFormKeyStatus =
    | MagicFormStatus.quiet
    | MagicFormStatus.pending
    | MagicFormStatus.fulfilled
    | MagicFormStatus.rejected;

export interface MagicFormDetail {
    name: string | Symbol;
    action: string;
    target: HTMLFormElement;
    observe(state: MagicFormActionStatus): void;
    submitter?: MagicFormSubmitter;
}

export interface MagicFormsActions {
    [action: string]: Action;
}

export interface MagicFormActionStatus {
    result?: any;
    timestamp?: number;
    status: MagicFormKeyStatus;
}

export interface MagicForms {
    [form: string]: MagicFormActionStatus;
}

export type Action = (
    form: HTMLFormElement,
    submitter?: MagicFormSubmitter
) => Promise<any>;

export const eventTypeMagicFormSubmit = "MagicFormSubmit";

/**
 * Capture the submit event and send it to the provider so that it can be resolved
 */
export function useMagicForm(
    ref: Ref<HTMLFormElement>,
    options?: { action?: string; name?: string }
) {
    const [state, setState] = useState<MagicFormActionStatus>();

    const dispatchSubmit = useEvent<MagicFormDetail>(eventTypeMagicFormSubmit, {
        bubbles: true,
        composed: true,
    });

    const submit = (event?: DOMEvent<HTMLFormElement, SubmitEvent>) => {
        if (event) event.preventDefault();

        const { current: target } = ref as any;

        dispatchSubmit({
            target,
            action: options?.action || target.getAttribute("action") || "",
            name: options?.name || target.getAttribute("name") || "",
            observe: setState,
            submitter: event?.submitter as any,
        });
    };
    //@ts-ignore
    useListener(ref, "submit", submit);

    const res: [MagicFormActionStatus, () => void] = [state, submit];
    return res;
}

/**
 * Resolves requests sent by useMagicForm
 */
export function useMagicFormProvider(
    ref: Ref,
    actions: MagicFormsActions = {}
) {
    const [forms, setForms] = useState<{
        [action: string]: Map<
            HTMLFormElement | string | Symbol,
            MagicFormActionStatus
        >;
    }>({});

    useListener(
        ref,
        eventTypeMagicFormSubmit,
        //@ts-ignore
        (event: CustomEvent<MagicFormDetail>) => {
            const {
                detail: { action, target, observe, name, submitter },
            } = event;
            // If the action is not found the event will continue to bubble
            if (!actions[action]) return;
            event.stopPropagation();

            const id = name || target;

            setForms((forms) => {
                if (!forms[action]) {
                    forms = {
                        ...forms,
                        [action]: new Map(),
                    };
                }

                const prev = forms[action].get(id);

                if (!prev || prev.status != MagicFormStatus.pending) {
                    let nextForms = new Map(forms[action]);
                    const timestamp = Date.now();

                    let current: MagicFormActionStatus = {
                        timestamp,
                        status: MagicFormStatus.pending,
                    };

                    nextForms.set(id, current);

                    observe(current);

                    const update = (current: MagicFormActionStatus) => {
                        setForms((forms) => ({
                            ...forms,
                            [action]: new Map(forms[action]).set(id, current),
                        }));
                        observe(current);
                    };

                    const fn = actions[action];
                    // the listening process will generate an update on the same state once the promise is resolved
                    fn &&
                        fn(target, submitter)
                            .then((result) =>
                                update({
                                    result,
                                    timestamp,
                                    status: MagicFormStatus.fulfilled,
                                })
                            )
                            .catch((result) =>
                                update({
                                    result,
                                    timestamp,
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

export function useMagicFormProviderState(
    ref: Ref<
        typeof import("./components/magic-form-provider").MagicFormProvider
    >
) {
    const [forms, setForms] = useState<MagicForms>({});
    useListener(
        ref,
        "ChangeForms",
        () => ref.current?.forms && setForms(ref.current.forms)
    );
    return forms;
}

export function useMagicFormState(
    ref: Ref<typeof import("./components/magic-form").MagicForm>
) {
    const [state, setState] = useState<MagicFormActionStatus>({
        status: MagicFormStatus.quiet,
    });
    useListener(
        ref,
        "ChangeState",
        () => ref.current?.state && setState(ref.current.state)
    );
    return state;
}
