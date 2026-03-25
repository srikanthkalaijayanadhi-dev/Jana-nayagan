const fs = require('fs');
const castData = JSON.parse(fs.readFileSync('cast_data.json', 'utf8'));

let html = `
    <!-- Cast Section -->
    <section class="media-section fade-up" id="cast" style="padding-top: 80px; padding-bottom: 80px;">
        <div style="margin-bottom: 50px;">
            <h2 class="section-title" style="text-align: left; margin-top: 0; margin-bottom: 20px; font-family: var(--font-hero); font-size: 3.5rem;">The <span style="color: var(--gold);">Cast</span></h2>
            <div style="width: 100px; height: 2px; background: linear-gradient(to right, var(--gold), transparent);"></div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px;">
`;

for (const actor of castData) {
    const role = actor.role.toUpperCase();
    const initials = actor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const bgImage = actor.img ? `background-image: url('${actor.img}'); background-size: cover; background-position: center; border-color: transparent;` : `background-color: transparent; border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--gold); font-family: var(--font-hero);`;

    html += `
            <div class="glass-panel cast-card" style="padding: 40px 20px; text-align: center; border-radius: 12px; background: rgba(18,18,26,0.6); box-shadow: 0 10px 20px rgba(0,0,0,0.5); border: 1px solid rgba(212,175,55,0.15); transition: 0.3s; display: flex; flex-direction: column; align-items: center;" onmouseover="this.style.borderColor='var(--gold)'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='rgba(212,175,55,0.15)'; this.style.transform='translateY(0)';">
                
                <div style="width: 120px; height: 120px; border-radius: 50%; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); position: relative; ${actor.img ? '' : 'border: 2px solid var(--gold);'}">
                    <div style="width: 100%; height: 100%; border-radius: 50%; ${bgImage}">
                        ${actor.img ? '' : initials}
                    </div>
                </div>
                
                <h3 style="color: white; font-family: var(--font-cond); font-size: 1.8rem; margin: 0 0 5px 0; letter-spacing: 1px;">${actor.name}</h3>
                <h4 style="color: var(--gold); font-family: var(--font-cond); font-size: 1rem; margin: 0 0 20px 0; letter-spacing: 2px; font-weight: 500;">${role}</h4>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin: 0;">${actor.extract}</p>
            </div>
`;
}

html += `
        </div>
    </section>
`;

fs.writeFileSync('cast_section.html', html);
console.log('Generated cast_section.html');
