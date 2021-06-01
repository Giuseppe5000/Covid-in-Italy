const todayDeath = document.getElementById('death');
const casi = document.getElementById('casi');
const totaleDeath = document.getElementById('totale-death');
const totaleCasi = document.getElementById('totale-casi');
const date = document.getElementById('date');

let d = new Date();
date.innerHTML = `<strong>${d.getDate()} / ${d.getMonth() + 1}  / ${d.getFullYear()}</strong>`

const getCovid = (callback) => {
    const request = new XMLHttpRequest();

    request.addEventListener('readystatechange', () => {
        if (request.readyState === 4 && request.status === 200) {
            const data = JSON.parse(request.responseText);
            callback(undefined, data);
        } else if (request.readyState === 4) {
            callback('errore', undefined);
        }
    })

    request.open('GET', `https://corona-api.com/countries/IT`)
    request.send();
};


getCovid((err, data) => {
    if (err) {
        console.log('errore');
    } else {
        const dataCovid = [];
        const dataCovidDay = [];

        todayDeath.innerHTML = `<strong>Morti : ${data['data']['today']['deaths']}</strong>`;
        casi.innerHTML = `<strong>Casi confermati : ${data['data']['today']['confirmed']}</strong>`;

        totaleDeath.innerHTML = `<strong>Morti totali : ${data['data']['latest_data']['deaths']}</strong>`
        totaleCasi.innerHTML = `<strong>Casi totali : ${data['data']['latest_data']['confirmed']}</strong>`

        data['data']['timeline'].forEach(element => {
            dataCovid.push(element.new_confirmed);
            dataCovidDay.push(element.date);
        });

        dataCovid.reverse();
        dataCovidDay.reverse();

        const dataChart = {
            labels: dataCovidDay,
            datasets: [{
                label: 'Casi del giorno',
                data: dataCovid,
                fill: false,
                borderColor: 'rgb(37, 80, 196)',
                tension: 0.1
            }]
        };
        let ctx = document.getElementById('myChart').getContext('2d');

        const totalDuration = 10000;
        const delayBetweenPoints = totalDuration / dataCovid.length;
        const animation = {
            x: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: NaN, // the point is initially skipped
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.xStarted) {
                        return 0;
                    }
                    ctx.xStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            }
        };

        let myChart = new Chart(ctx, {
            type: 'line',
            data: dataChart,
            options: {
                animation: animation,
                responsive: true,
                interaction: {
                    intersect: false
                },
                plugins: {
                    legend: false
                },
                scales: {
                    x: {
                        type: 'linear'
                    }
                }
            }
        });

    }
});