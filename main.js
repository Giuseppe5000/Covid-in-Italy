const todayDeath = document.getElementById('death');
const casi = document.getElementById('casi');
const totaleDeath = document.getElementById('totale-death');
const totaleCasi = document.getElementById('totale-casi');


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

        todayDeath.innerText = `Morti : ${data['data']['today']['deaths']}`;
        casi.innerText = `Casi confermati : ${data['data']['today']['confirmed']}`;

        totaleDeath.innerText = `Morti totali : ${data['data']['latest_data']['deaths']}`
        totaleCasi.innerText = `Casi totali : ${data['data']['latest_data']['confirmed']}`

        data['data']['timeline'].forEach(element => {
            dataCovid.push(element.new_confirmed);
            dataCovidDay.push(element.date);
        });

        dataCovid.reverse();
        dataCovidDay.reverse();

        const dataChart = {
            labels: dataCovidDay,
            datasets: [{
                label: 'Andamento del virus',
                data: dataCovid,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };
        var ctx = document.getElementById('myChart').getContext('2d');

        var myChart = new Chart(ctx, {
            type: 'line',
            data: dataChart,
            options: {
                //animation,
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
