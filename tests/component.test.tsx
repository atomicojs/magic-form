//@ts-ignore
import { expect } from "@esm-bundle/chai";
import { fixture } from "atomico/test-dom";
import { MagicFormProvider, MagicForm } from "../src/components.js";

describe("test", () => {
    it("MagicFormProvider", async () => {
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
        const nodeMagicFormProvider = fixture<
            InstanceType<typeof MagicFormProvider>
        >(
            <MagicFormProvider
                actions={{
                    async add(form) {
                        spyAdd.push(form);
                        return true;
                    },
                }}
            >
                <MagicForm
                    onChangeState={(event) => {
                        expect(expectOnMagicForm.shift()).to.deep.equal(
                            event.currentTarget.state
                        );
                        if (!expectOnMagicForm.length) resolve();
                    }}
                >
                    <form action="add"></form>
                </MagicForm>
            </MagicFormProvider>
        );

        // const nodeMagicForm = nodeMagicFormProvider.querySelector("magic-form");
        // const nodeForm = nodeMagicFormProvider.querySelector("form");

        // setTimeout(() => {
        //     let i = 10;
        //     while (i--) {
        //         nodeMagicForm.dispatchEvent(
        //             new Event("submit", {
        //                 bubbles: true,
        //             })
        //         );
        //     }
        // }, 100);

        // await task;

        // expect(spyAdd.length).to.equal(1);

        // expect(spyAdd).to.deep.equal([nodeForm.current]);
    });
});
