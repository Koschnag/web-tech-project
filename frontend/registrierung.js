document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const salutation = document.getElementById('salutation').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const confirmEmail = document.getElementById('confirmEmail').value;
    const birthDate = document.getElementById('birthDate').value;
    const zipCode = document.getElementById('zipCode').value;

    let isValid = true;

    // Validate email match
    if (email !== confirmEmail) {
        document.getElementById('confirmEmail').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('confirmEmail').classList.remove('is-invalid');
    }

    // Validate age
    const birthDateObj = new Date(birthDate);
    const age = new Date().getFullYear() - birthDateObj.getFullYear();
    if (isNaN(age) || age < 18) {
        document.getElementById('birthDate').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('birthDate').classList.remove('is-invalid');
    }

    // Validate ZIP code
    if (!/^\d{5}$/.test(zipCode)) {
        document.getElementById('zipCode').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('zipCode').classList.remove('is-invalid');
    }

    if (isValid) {
        // Store data in local storage
        const userData = { salutation, firstName, lastName, email, birthDate, zipCode };
        localStorage.setItem('userData', JSON.stringify(userData));

        // Show success message and hide form
        document.getElementById('registrationForm').classList.add('d-none');
        document.getElementById('successMessage').classList.remove('d-none');
    }
});
