import {
  AbstractControl,
  FormArray,
  FormGroup,
  ɵFormGroupRawValue,
  ɵFormGroupValue,
} from '@angular/forms';
import { ɵRuntimeError as RuntimeError } from '@angular/core';
import { ERuntimeErrorCode } from './errors/errors-consts';
import { environment } from '../../environments/environment';
import {
  missingControlError,
  missingControlValueError,
  noControlsError,
} from './errors/reactive-errors-logs';
import {ControlsWrapper, ExtractForm} from "./types/sub-types";

function assertAllValuesPresent(control: any, isGroup: boolean, value: any): void {
  control._forEachChild((_: unknown, key: string | number) => {
    if (value[key] === undefined) {
      throw new RuntimeError(
        ERuntimeErrorCode.MISSING_CONTROL_VALUE,
        environment.production ? '' : missingControlValueError(isGroup, key)
      );
    }
  });
}

export function assertControlPresent(parent: any, isGroup: boolean, key: string | number): void {
  const controls = parent.controls as { [key: string | number]: unknown };
  const collection = isGroup ? Object.keys(controls) : controls;

  if (collection.length === 0) {
    throw new RuntimeError(
      ERuntimeErrorCode.NO_CONTROLS,
      environment.production ? '' : noControlsError(isGroup)
    );
  }

  if (!controls[key]) {
    throw new RuntimeError(
      ERuntimeErrorCode.MISSING_CONTROL,
      environment.production ? '' : missingControlError(isGroup, key)
    );
  }
}

export class FormGroupWrapper<TItem> extends FormGroup<ControlsWrapper<TItem>> {
  public override setValue(
    value: TItem & ɵFormGroupRawValue<any>,
    options?: { onlySelf?: boolean; emitEvent?: boolean }
  ): void {
    assertAllValuesPresent(this, true, value);

    for (const name of Object.keys(value) as (keyof TItem)[]) {
      assertControlPresent(this, true, name as any);
      const control = (this.controls as any)[name];
      const currentValue = (value as any)[name];

      if (control instanceof FormArray && Array.isArray(currentValue)) {
        control.clear();

        for (const item of currentValue as AbstractControl<any, any>[]) {
          item.setParent(control);
          control.push(item, { emitEvent: options?.emitEvent });
        }
      } else {
        control.setValue(currentValue, {
          onlySelf: true,
          emitEvent: options?.emitEvent,
        });
      }
    }

    this.updateValueAndValidity(options);
  }

  public override patchValue(
    value: Partial<TItem> | ɵFormGroupValue<any>,
    options?: { onlySelf?: boolean; emitEvent?: boolean }
  ): void {
    if (value === null) {
      return;
    }

    for (const name of Object.keys(value) as (keyof TItem)[]) {
      const control = (this.controls as any)[name];
      const currentValue = value[name as keyof ({ [key: string]: any } | Partial<TItem>)]!;

      if (control) {
        if (control instanceof FormArray && Array.isArray(currentValue)) {
          control.clear();

          for (const item of currentValue as AbstractControl<any, any>[]) {
            item.setParent(control);
            control.push(item, { emitEvent: options?.emitEvent });
          }
        } else {
          control.patchValue(currentValue, {
            onlySelf: true,
            emitEvent: options?.emitEvent,
          });
        }
      }
    }

    this.updateValueAndValidity(options);
  }

  public getDirtyValues(): Partial<ExtractForm<TItem>> {
    const values: Partial<ExtractForm<TItem>> = {};

    for (const key of Object.keys(this.controls)) {
      const control = this.get(key);

      if (control?.dirty) {
        values[key as keyof TItem] = control.getRawValue();
      }
    }

    return values;
  }
}
