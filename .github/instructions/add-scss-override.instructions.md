Add given css variable to either the `sky-default-overrides` mixin based on the input.

Add the variable to the mixin in alphabetical order.

If the mixin that the variable is to be added to doesn't exist - add it to the top of the file after the imports. Do not add any other variable to the new mixin.

If neither mixin exists - add the per #file:scss-override-mixins.instructions.md but only add the mixin that is required

If asked to use it with the current value, find the place in the scss that matches the new variable name.
Use the value in this current location and assign the new variable that value.
Use the new variable in the current location with the given fallback.

Do not add any comments in the code.
Remove any `TODO:` comments added by #file:scss-override-mixins.instructions.md
