# @atomico/magic-form

A powerful form submission manager created with Atomicojs webcomponents, with MagicForm you can:

1. Simplify the sending of forms by centralizing the sending actions through a provider.
2. Know at all times the forms that are being provided and show their status.
3. Isolate a group of actions according to provider, this means that if a provider does not register the action it will bubble to the parent provider.

## Some code

```jsx
<MagicFormProvider
    actions={{
        async login(form) {
            const result = await fetch("https://my-api.com/login", {
                method: "post",
                body: new FormData(form),
            });

            const data = await result.json();

            return data;
        },
    }}
>
    <MagicForm>
        <form action="login">
            <input type="email" name="email" />
            <input type="password" name="password" />
            <button>Login</button>
        </form>
    </MagicForm>
</MagicFormProvider>
```

## Support

[![twitter](https://raw.githubusercontent.com/atomicojs/docs/master/.gitbook/assets/twitter.svg)](https://twitter.com/atomicojs)
[![discord](https://raw.githubusercontent.com/atomicojs/docs/master/.gitbook/assets/discord.svg)](https://discord.gg/7z3rNhmkNE)
[![documentation](https://raw.githubusercontent.com/atomicojs/docs/master/.gitbook/assets/doc-1.svg)](https://atomico.gitbook.io/doc/atomico/atomico-magic-form)
