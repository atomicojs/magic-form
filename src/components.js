import { MagicForm } from "./components/magic-form";
import { MagicFormProvider } from "./components/magic-form-provider";
export { MagicForm } from "./components/magic-form";
export { MagicFormProvider } from "./components/magic-form-provider";

customElements.define("magic-form-provider", MagicFormProvider);
customElements.define("magic-form", MagicForm);
