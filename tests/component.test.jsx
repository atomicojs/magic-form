//@ts-ignore
import { expect } from "@esm-bundle/chai";
import { fixture } from "atomico/test-dom";
import { MagicFormProvider, MagicForm } from "../src/components";

it("MagicFormProvider", (done) => {
    const refMagicForm = {};
    const refMagicFormProvider = {};
    const refForm = {};

    fixture(
        <MagicFormProvider
            ref={refMagicFormProvider}
            actions={{
                add(form) {
                    return Promise.resolve(true);
                },
            }}
        >
            <MagicForm ref={refMagicForm}>
                <form ref={refForm} action="add"></form>
            </MagicForm>
        </MagicFormProvider>
    );

    await refMagicFormProvider.current.updated;
});
