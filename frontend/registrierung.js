function sanitizeInput(input) {
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
}

function showValidationError(elementId, condition, errorMessage) {
    const element = document.getElementById(elementId);
    if (condition) {
        element.classList.add('is-invalid');
        element.nextElementSibling.textContent = errorMessage;
        return false;
    } else {
        element.classList.remove('is-invalid');
        return true;
    }
}

document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const salutation = sanitizeInput(document.getElementById('salutation').value);
    const firstName = sanitizeInput(document.getElementById('firstName').value);
    const lastName = sanitizeInput(document.getElementById('lastName').value);
    const email = sanitizeInput(document.getElementById('email').value);
    const confirmEmail = sanitizeInput(document.getElementById('confirmEmail').value);
    const birthDate = sanitizeInput(document.getElementById('birthDate').value);
    const zipCode = sanitizeInput(document.getElementById('zipCode').value);

    let isValid = true;

    // Validate email match
    isValid &= showValidationError(
        'confirmEmail',
        email !== confirmEmail,
        'Die E-Mail-Adressen stimmen nicht überein.'
    );

    // Validate age
    const birthDateObj = new Date(birthDate);
    const age = new Date().getFullYear() - birthDateObj.getFullYear();
    isValid &= showValidationError(
        'birthDate',
        isNaN(age) || age < 18,
        'Sie müssen mindestens 18 Jahre alt sein.'
    );

    // Validate ZIP code
    isValid &= showValidationError(
        'zipCode',
        !/^\d{5}$/.test(zipCode),
        'Bitte geben Sie eine gültige fünfstellige PLZ ein.'
    );

    if (isValid) {
        // Store data in local storage
        const userData = { salutation, firstName, lastName, email, birthDate, zipCode };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Show success message and hide form
        document.getElementById('registrationForm').classList.add('d-none');
        document.getElementById('successMessage').classList.remove('d-none');
    }
});
