function describeKey(isFormGroup: boolean, key: string | number): string {
  return isFormGroup ? `with name: '${key}'` : `at index: ${key}`;
}

export function noControlsError(isFormGroup: boolean): string {
  return `
    There are no form controls registered with this ${
      isFormGroup ? 'group' : 'array'
    } yet. If you're using ngModel,
    you may want to check next tick (e.g. use setTimeout).
  `;
}

export function missingControlError(isFormGroup: boolean, key: string | number): string {
  return `Cannot find form control ${describeKey(isFormGroup, key)}`;
}

export function missingControlValueError(isFormGroup: boolean, key: string | number): string {
  return `Must supply a value for form control ${describeKey(isFormGroup, key)}`;
}
