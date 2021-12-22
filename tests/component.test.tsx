//@ts-ignore
import { expect } from "@esm-bundle/chai";
import { DOMCustomEvent, Ref } from "atomico";
import { fixture } from "atomico/test-dom";
import { MagicFormProvider, MagicForm } from "../src/components";

it("MagicFormProvider", async () => {
    const refMagicForm: Ref<typeof MagicForm> = {};
    const refMagicFormProvider: Ref<typeof MagicFormProvider> = {};
    const refForm: Ref<HTMLFormElement> = {};

    const expectOnMagicForm = [
        {
            status: "pending",
        },
        {
            status: "fulfilled",
            result: true,
        },
    ];

    let resolve: (value?: any) => void;
    let spyAdd = [];
    const task = new Promise((r) => (resolve = r));

    fixture(
        <MagicFormProvider
            ref={refMagicFormProvider}
            actions={{
                async add(form) {
                    spyAdd.push(form);
                    return true;
                },
            }}
        >
            <MagicForm
                ref={refMagicForm}
                onChangeState={(
                    event: DOMCustomEvent<null, InstanceType<typeof MagicForm>>
                ) => {
                    expect(expectOnMagicForm.shift()).to.deep.equal(
                        event.target.state
                    );
                    if (!expectOnMagicForm.length) resolve();
                }}
            >
                <form ref={refForm} action="add"></form>
            </MagicForm>
        </MagicFormProvider>
    );

    setTimeout(() => {
        let i = 10;
        while (i--) {
            refForm.current.dispatchEvent(
                new Event("submit", {
                    bubbles: true,
                })
            );
        }
    }, 100);

    await task;

    expect(spyAdd.length).to.equal(1);

    expect(spyAdd).to.deep.equal([refForm.current]);
});
