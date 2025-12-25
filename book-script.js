const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby5vkTbOl2egEzVvO6UWcL9zebrC0fP5_RyjBesSVdfnhv-B7Wbjwta2PJdiaeaa3UBfw/exec';

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    
    // Disable submit button to prevent double submissions
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Prepare data to send
    const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };
    
    // Send data to Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(function() {
        console.log('Success! Data sent to Google Sheets');
        
        // Hide the form
        document.getElementById('signupForm').style.display = 'none';
        
        // Show success message
        document.getElementById('successMessage').classList.add('show');
    })
    .catch(function(error) {
        console.error('Error:', error);
        alert('Oops! Something went wrong. Please try again.');
        
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Notify Me at Launch!';
    });
});