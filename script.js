document.addEventListener('DOMContentLoaded', () => {
    const deskGrid = document.getElementById('desk-grid');
    const bookingForm = document.getElementById('booking-form');
    const summary = document.getElementById('summary');
    const deskTypeElement = document.getElementById('desk-type');
    const membershipTierSection = document.getElementById('membership-tier-section');
    const membershipTierElement = document.getElementById('membership-tier');
    const hoursElement = document.getElementById('hours');
    const selectedDeskIdElement = document.getElementById('selected-desk-id');
    
    const desks = Array(15).fill().map((_, i) => ({
        id: i + 1,
        type: i < 10 ? 'individual' : 'team',
        booked: false,
        hours: 0,
        total: 0
    }));

    function renderDesks() {
        deskGrid.innerHTML = '';
        desks.forEach(desk => {
            const deskElement = document.createElement('div');
            deskElement.classList.add('desk');
            deskElement.classList.toggle('booked', desk.booked);
            deskElement.textContent = `Desk ${desk.id} (${desk.type})`;
            deskElement.addEventListener('click', () => selectDesk(desk.id));
            deskGrid.appendChild(deskElement);
        });
    }

    // Load bookings from local storage
    function loadBookings() {
        const savedBookings = JSON.parse(localStorage.getItem('bookings'));
        if (savedBookings) {
            savedBookings.forEach(booking => {
                const desk = desks.find(d => d.id === booking.id);
                if (desk) {
                    desk.booked = booking.booked;
                    desk.hours = booking.hours;
                    desk.total = booking.total;
                }
            });
        }
    }

    // // Save bookings to local storage
    function saveBookings() {
        localStorage.setItem('bookings', JSON.stringify(desks));
    }

    function displayBookingSummary() {
        const bookedDesks = desks.filter(desk => desk.booked);
        if (bookedDesks.length > 0) {
            let summaryHTML = '<h3>Booking Summary</h3>';
            let totalAmount = 0;
            bookedDesks.forEach(desk => {
                summaryHTML += `
                    <p>Desk ${desk.id} booked for ${desk.hours} hours</p>
                    <p>Amount: $${desk.total.toFixed(2)}</p>
                `;
                totalAmount += desk.total;
            });
            summaryHTML += `<h4>Total Amount: $${totalAmount.toFixed(2)}</h4>`;
            summary.innerHTML = summaryHTML;
        } else {
            summary.innerHTML = '';
        }
    }

    // bookDesk
    function bookDesk() {
        const deskType = deskTypeElement.value;
        const membershipTier = membershipTierElement.value;
        const hours = parseInt(hoursElement.value, 10);

        
        if (!deskType || (deskType === 'individual' && !membershipTier) || !hours) {
            alert('Fill form first');
            return;
        }
        
        const availableDesks = desks.filter(desk => desk.type === deskType && !desk.booked);

        if (availableDesks.length === 0) {
            alert('No available desks of the selected type');
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableDesks.length);
        const desk = availableDesks[randomIndex];

        let rate = 0;
        if (deskType === 'individual') {
            switch (membershipTier) {
                case 'basic': rate = 10; break;
                case 'premium': rate = 15; break;
                case 'executive': rate = 20; break;
            }
        } else {
            rate = 25;
        }

        let total = rate * hours;
        if (hours > 3) {
            total *= 0.9;
        }

        desk.booked = true;
        desk.hours = hours;
        desk.total = total;
        saveBookings();
        renderDesks();
        displayBookingSummary();
    }

    // Show/hide membership tier section based on desk type
    deskTypeElement.addEventListener('change', () => {
        if (deskTypeElement.value === 'team') {
            membershipTierSection.style.display = 'none';
        } else {
            membershipTierSection.style.display = 'block';
        }
    });

    document.getElementById('book-desk').addEventListener('click', bookDesk);

    loadBookings();
    renderDesks();
    displayBookingSummary();
});
