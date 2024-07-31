# FormGroupWrapper

## Description
Hello everyone!

This is a wrapper for the FormGroup class, which has the following advantages over the usual FormGroup.

## Advantages
1. Simplifies the typing of controls of the usual FormGroup. It is enough to specify the corresponding interface when initializing the object, for example new FormGroupWrapper<IWaybillForm> and FormGroupWrapper itself will create the necessary types for the corresponding controls (FormControl's)
2. Highlights the available properties of the object in the methods setValue(), patchValue().
3. Checks the filling of mandatory fields at the type level (FormGroup only displays an error message in the console, i.e. it is impossible to track the error before compilation).
4. Allows you to fill in the properties of the FormArray type nested in the formGroup via the methods setValue(), patchValue().
5. Has a typed getDirtyValues() method, which works almost like a regular getRawValue(), only instead of returning all values, the getDirtyValues() method returns the values ​​of only those fields that have been changed (marked as dirty).

## About project

```node -v``` - v21.7.3

```yarn -v``` - 1.22.22

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.2.

## Karma tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
