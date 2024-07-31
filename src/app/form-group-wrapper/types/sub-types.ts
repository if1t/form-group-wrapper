import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export type ExtractForm<T> = {
  [K in keyof T]: T[K] extends FormGroup<infer U>[]
    ? (U extends ControlsWrapper<infer V> ? V : never)[]
    : T[K];
};

export type ControlsWrapper<T> = {
  [K in keyof T]: T[K] extends (infer U extends AbstractControl<any, any>)[]
    ? FormArray<U>
    : FormControl<T[K]>;
};
