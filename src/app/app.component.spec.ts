import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {FormGroupWrapper} from "./form-group-wrapper/form-group-wrapper";
import {ControlsWrapper} from "./form-group-wrapper/types/sub-types";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

interface IEmail {
  id: number;
  email: string;
}

interface IRole {
  id: number;
  name: string;
  permissions: string[];
}

interface IProfile {
  id: number | null;
  code: string | null;
  name?: string | null;
  address: {
    street?: string;
    city: string;
  } | null;
  roles: IRole[];
  emails: FormGroup<ControlsWrapper<IEmail>>[];
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('example', () => {
    // test set entity
    const profile: IProfile = {
      id: 1,
      code: 'CODE',
      address: {
        city: 'Ulan-Ude'
      },
      roles: [{id: 1, name: 'ADMIN', permissions: ['READ', 'WRITE']}],
      emails: [
        new FormGroup<ControlsWrapper<IEmail>>({
            id: new FormControl(1, {nonNullable: true}),
            email: new FormControl('admin@example.com', {nonNullable: true, validators: [Validators.required, Validators.email]})
          })
      ],
    }

    // test form
    const profileForm: FormGroupWrapper<IProfile> = new FormGroupWrapper<IProfile>({
      id: new FormControl(null),
      code: new FormControl(null),
      address: new FormControl(null),
      roles: new FormControl([], {nonNullable: true}),
      emails: new FormArray<FormGroup<ControlsWrapper<IEmail>>>([]),
    });

    profileForm.setValue(profile)
    const formValues = profileForm.getRawValue();

    expect(formValues.id).toEqual(profile.id);
    expect(formValues.code).toEqual(profile.code);
    expect(JSON.stringify(formValues.address)).toEqual(JSON.stringify(profile.address));
    expect(JSON.stringify(formValues.roles)).toEqual(JSON.stringify(profile.roles));
    expect(JSON.stringify(formValues.emails)).toEqual(JSON.stringify(profile.emails.map(item => item.getRawValue())));

    // update entity
    const profileUpdate: Partial<IProfile> = {
      code: 'UPDATED_CODE',
      address: {
        city: 'Moscow',
      },
      emails: [new FormGroup<ControlsWrapper<IEmail>>({
        id: new FormControl(2, {nonNullable: true}),
        email: new FormControl('updated-email@example.com', {nonNullable: true, validators: [Validators.email]})
      })]
    }

    profileForm.patchValue(profileUpdate);
    profileForm.controls.code.markAsDirty();
    profileForm.controls.address.markAsDirty();
    profileForm.controls.emails.markAsDirty();

    // get dirty controls values
    const formDirtyValues = profileForm.getDirtyValues();

    expect(formDirtyValues.id).toEqual(undefined);
    expect(formDirtyValues.code).toEqual(profileUpdate.code);
    expect(JSON.stringify(formDirtyValues.address)).toEqual(JSON.stringify(profileUpdate.address));
    expect(formDirtyValues.roles).toEqual(undefined);
    expect(JSON.stringify(formDirtyValues.emails)).toEqual(JSON.stringify(profileUpdate.emails?.map(item => item.getRawValue())));
  });
});
