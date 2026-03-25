// Particle Background
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 60; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDuration = (Math.random() * 8 + 4) + 's';
            particle.style.animationDelay = (Math.random() * 5) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            particlesContainer.appendChild(particle);
        }

        // Countdown Timer
        function updateTimer() {
            const now = new Date();
            const launchDate = new Date(2026, 8, 1, 0, 0, 0); // September 1, 2026
            const diff = launchDate - now;
            
            if (diff > 0) {
                const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / 1000 / 60) % 60);
                const s = Math.floor((diff / 1000) % 60);
                
                document.getElementById('days').innerText = d.toString().padStart(2, '0');
                document.getElementById('hours').innerText = h.toString().padStart(2, '0');
                document.getElementById('mins').innerText = m.toString().padStart(2, '0');
                document.getElementById('secs').innerText = s.toString().padStart(2, '0');
            }
        }
        setInterval(updateTimer, 1000);
        updateTimer();

        // 3D Tilt Effect on Movie Cards
        document.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation based on mouse position
                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;
                
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                
                // Move glare effect
                const glare = card.querySelector('.glare');
                if (glare) {
                    glare.style.transform = `translate(${x}px, ${y}px)`;
                    glare.style.opacity = 1;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
                const glare = card.querySelector('.glare');
                if (glare) glare.style.opacity = 0;
            });
        });

        // Intersection Observer for Scroll Animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

        // Selection Chips Logic
        function selectChip(el, type) {
            const container = el.parentElement;
            container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            el.classList.add('active');
            
            if (type === 'date') {
                const dateText = el.querySelector('.chip-date').innerText;
                document.getElementById('summary-date').innerText = dateText + ' 2026';
            } else if (type === 'time') {
                document.getElementById('summary-time').innerText = el.innerText;
            }
            
            // Randomly re-generate seats for demo effect
            generateSeatMap();
        }

        function scrollSection(btn, amount) {
            const container = btn.parentElement.querySelector('.scroll-container');
            if (container) {
                container.scrollLeft += amount;
            }
        }

        // 3D Seat Map Generation
        const seatingAreas = [
            { name: 'RECLINER', rows: ['A', 'B'], seats: 12, price: 350, gap: [6] },
            { name: 'PREMIUM', rows: ['C', 'D', 'E'], seats: 16, price: 250, gap: [4, 12] },
            { name: 'EXECUTIVE', rows: ['F', 'G', 'H', 'I'], seats: 20, price: 190, gap: [4, 16] },
            { name: 'GENERAL', rows: ['J', 'K'], seats: 20, price: 150, gap: [4, 16] }
        ];

        let selectedSeats = [];
        let totalPrice = 0;

        function generateSeatMap() {
            const wrapper = document.getElementById('seats-wrapper');
            wrapper.innerHTML = '';
            selectedSeats = [];
            totalPrice = 0;
            updateSummary();

            seatingAreas.forEach(area => {
                // Area Label
                const areaLabel = document.createElement('div');
                areaLabel.className = 'seat-category-label';
                areaLabel.innerText = `${area.name} - ₹${area.price}`;
                wrapper.appendChild(areaLabel);

                // Area Rows
                area.rows.forEach(row => {
                    const rowDiv = document.createElement('div');
                    rowDiv.className = 'seat-row';
                    
                    const rowLabel = document.createElement('div');
                    rowLabel.className = 'row-label';
                    rowLabel.innerText = row;
                    rowDiv.appendChild(rowLabel);

                    for (let i = 1; i <= area.seats; i++) {
                        const seat = document.createElement('div');
                        seat.className = 'seat';
                        seat.dataset.id = `${row}${i}`;
                        seat.dataset.price = area.price;
                        
                        // Tooltip
                        const tooltip = document.createElement('span');
                        tooltip.innerText = `${row}${i} (₹${area.price})`;
                        seat.appendChild(tooltip);

                        // Random booking simulation
                        if (Math.random() < 0.25) {
                            seat.classList.add('booked');
                        } else {
                            seat.addEventListener('click', toggleSeat);
                        }
                        
                        // Add aisle gaps
                        if (area.gap.includes(i)) {
                            seat.classList.add('aisle');
                        }
                        
                        rowDiv.appendChild(seat);
                    }
                    wrapper.appendChild(rowDiv);
                });
            });
        }

        function toggleSeat(e) {
            const seat = e.currentTarget;
            if (seat.classList.contains('booked')) return;
            
            const seatId = seat.dataset.id;
            const price = parseInt(seat.dataset.price);

            if (seat.classList.contains('selected')) {
                seat.classList.remove('selected');
                selectedSeats = selectedSeats.filter(s => s !== seatId);
                totalPrice -= price;
            } else {
                if (selectedSeats.length >= 6) {
                    alert('Maximum 6 seats can be booked per transaction.');
                    return;
                }
                seat.classList.add('selected');
                selectedSeats.push(seatId);
                totalPrice += price;
            }
            
            updateSummary();
        }

        function updateSummary() {
            const listEl = document.getElementById('selected-seats-list');
            const priceEl = document.getElementById('total-price');
            
            if (selectedSeats.length > 0) {
                listEl.innerText = selectedSeats.join(', ');
                priceEl.innerText = `₹${totalPrice}`;
            } else {
                listEl.innerText = 'None';
                priceEl.innerText = '₹0';
            }
        }

        function processPayment() {
            if (selectedSeats.length === 0) {
                alert('Please select at least one seat to proceed.');
                return;
            }
            alert(`Booking confirmed for ${selectedSeats.length} seats. \nTotal Amount: ₹${totalPrice} \nEnjoy the cinematic universe of JANANAYAGAN!`);
            generateSeatMap(); // reset
        }

        // Initialize Map
        generateSeatMap();