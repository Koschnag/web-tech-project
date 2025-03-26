import { RegistrationModel } from '../models/registrationModel.js';

export class RegistrationViewModel {
    constructor(view) {
        this.model = new RegistrationModel();
        this.view = view;
    }

    handleInputChange(field, value) {
        this.model.userData[field] = value;
    }

    handleSubmit() {
        const errors = this.model.validate();
        if (Object.keys(errors).length === 0) {
            this.model.save();
            this.view.showSuccessMessage();
        } else {
            this.view.showErrors(errors);
        }
    }
}
