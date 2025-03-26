export class RegistrationModel {
    constructor() {
        this.userData = {
            salutation: '',
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            birthDate: '',
            zipCode: ''
        };
    }

    validate() {
        const errors = {};

        if (!this.userData.salutation) {
            errors.salutation = 'Bitte wählen Sie eine Anrede aus.';
        }
        if (!this.userData.firstName) {
            errors.firstName = 'Bitte geben Sie Ihren Vornamen ein.';
        }
         if (!this.userData.lastName) {
            errors.lastName = 'Bitte geben Sie Ihren Nachnamen ein.';
        }

        if (!this.userData.email) {
            errors.email = 'Bitte geben Sie eine E-Mail-Adresse ein.';
        }

        if (this.userData.email !== this.userData.confirmEmail) {
            errors.confirmEmail = 'Die E-Mail-Adressen stimmen nicht überein.';
        }

        if (!this.userData.birthDate) {
             errors.birthDate = 'Bitte geben Sie Ihr Geburtsdatum ein.';
        } else {
            const birthDateObj = new Date(this.userData.birthDate);
            const age = new Date().getFullYear() - birthDateObj.getFullYear();
            if (isNaN(age) || age < 18) {
                errors.birthDate = 'Sie müssen mindestens 18 Jahre alt sein.';
            }
        }


        if (!/^\d{5}$/.test(this.userData.zipCode)) {
            errors.zipCode = 'Bitte geben Sie eine gültige fünfstellige PLZ ein.';
        }

        return errors;
    }

    save() {
        localStorage.setItem('userData', JSON.stringify(this.userData));
    }
}
