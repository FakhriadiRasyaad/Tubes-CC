function getData(location) {
    return fetch("https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml")
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data =>{

            var timeArray = [];
            var temArray = [];
            var humArray = [];
            var winddirArray = [];
            var windspeedArray = [];
            var weatherArray = [];

            pathTem = `data/forecast/area[@description="${location}"]/parameter[@id="t"]/timerange/value[@unit="C"]`;
            pathHum = `data/forecast/area[@description="${location}"]/parameter[@id="hu"]/timerange/value`;
            pathWeather = `data/forecast/area[@description="${location}"]/parameter[@id="weather"]/timerange/value`;
            pathTime = `data/forecast/area[@description="${location}"]/parameter[@id="hu"]/timerange`;
            pathWD = `data/forecast/area[@description="${location}"]/parameter[@id="wd"]/timerange/value[@unit="deg"]`;
            pathWS = `data/forecast/area[@description="${location}"]/parameter[@id="ws"]/timerange/value[@unit="MS"]`;

            if(data.evaluate) {
                i = 0;
                var nodeT = data.evaluate(pathTem, data, null, XPathResult.ANY_TYPE, null);
                var nodeH = data.evaluate(pathHum, data, null, XPathResult.ANY_TYPE, null);
                var nodeWD = data.evaluate(pathWD, data, null, XPathResult.ANY_TYPE, null);
                var nodeWS = data.evaluate(pathWS, data, null, XPathResult.ANY_TYPE, null);
                var nodeW = data.evaluate(pathWeather, data, null, XPathResult.ANY_TYPE, null);
                var nodeTime = data.evaluate(pathTime, data, null, XPathResult.ANY_TYPE, null);
                var resultT = nodeT.iterateNext();
                var resultH = nodeH.iterateNext();
                var resultWD = nodeWD.iterateNext();
                var resultWS = nodeWS.iterateNext();
                var resultW = nodeW.iterateNext();
                var resultTime = nodeTime.iterateNext();

                while(resultT && resultH && resultWD && resultWS && resultW && resultTime) {
                    timeArray[i] = resultTime.getAttributeNode("datetime").nodeValue;
                    temArray[i] = resultT.childNodes[0].nodeValue;
                    humArray[i] = resultH.childNodes[0].nodeValue;
                    winddirArray[i] = resultWD.childNodes[0].nodeValue;
                    windspeedArray[i] = Math.floor(resultWS.childNodes[0].nodeValue);
                    weatherArray[i] = resultW.childNodes[0].nodeValue;

                    resultT = nodeT.iterateNext();
                    resultH = nodeH.iterateNext();
                    resultWD = nodeWD.iterateNext();
                    resultWS = nodeWS.iterateNext();
                    resultW = nodeW.iterateNext();
                    resultTime = nodeTime.iterateNext();
                    i++;
                }
            }

            var days = "";
            var dataHours = "";
            var dates = [];
            var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

            for (var i = 0; i < timeArray.length; i++) {
                var date = timeArray[i][6].toString() + timeArray[i][7].toString();
                var month = parseInt(timeArray[i][4] + timeArray[i][5]) - 1;
                var year = timeArray[i][0].toString() + timeArray[i][1].toString() + timeArray[i][2].toString() + timeArray[i][3].toString()
                var hour = timeArray[i][8].toString() + timeArray[i][9].toString();

                dates[i] = date;

                dataHours +=`
                    <div class="box">
                        <h3>${hour}.00</h3>
                        <img src="icons/w_${parseInt(weatherArray[i])}.png" width="85px"><br>
                        <i class="fas fa-temperature-high"></i> ${temArray[i]}<sup>o</sup>C<br>
                        <i class="fas fa-tint"></i> ${humArray[i]}%<br>
                        <i class="fas fa-location-arrow"></i> ${winddirArray[i]}<sup>o</sup><br>
                        <i class="fas fa-wind"></i> ${windspeedArray[i]} m/s<br>
                    </div>
                `;
                if(dates[i-1] != dates[i]){
                    days +=`<div class="box"><h3>${timeArray[i][6]}${timeArray[i][7]} ${months[month]} ${year}</h3></div>`
                }

                document.getElementById(`days${location}`).innerHTML = days;
                document.getElementById(`dataHours${location}`).innerHTML = dataHours;
            }
        })
}

const locationElements = {};

function searchLocation() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();

    for (const location in locationElements) {
        if (location.toLowerCase().includes(searchQuery)) {
            locationElements[location].scrollIntoView({ behavior: "smooth" });
            return;
        }
    }
}

function weatherPanel(locations) {
    let body = "";
    for (const location of locations) {
        body += `
            <div class="container" id="location-${location.toLowerCase().replace(/\s/g, '-')}">
                <div class="box">
                    <h1>${location}</h1>
                </div>
            </div>
            <div class="container" id="days${location}"></div>
            <div class="container" id="dataHours${location}"></div>
        `;
    }

    document.getElementById("main").innerHTML = body;

    for (const location of locations) {
        getData(location);
        locationElements[location] = document.getElementById(`location-${location.toLowerCase().replace(/\s/g, '-')}`);
    }
}

var input = document.getElementById("searchInput");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("myBtn").click();
  }
});

weatherPanel(["Bandung", "Soreang", "Cikarang", "Cibinong", "Ciamis", "Cianjur", "Sumber", "Indramayu", "Karawang", "Kuningan", "Majalengka", "Parigi", "Purwakarta", "Subang", "Sumedang", "Singaparna", "Bekasi", "Kota Bogor", "Cimahi", "Cirebon", "Depok", "Pelabuhan Ratu"])
//timeout()

// function weatherPanel(locations) {
//     let body = "";
//     for(let i = 0; i < locations.length; i++){
//         body += `
//             <div class="container" id="${locations[i]}" data-location="${locations[i]}">
//                 <div class="box"><h1>${locations[i]}</h1></div>
//                 <div class="container" id="days${locations[i]}"></div>
//                 <div class="container" id="dataHours${locations[i]}"></div>
//             </div>
//         `;
//     }

//     document.getElementById("main").innerHTML = body;
//     locations.forEach(location => getData(location));
// }

// function searchLocation() {
//     const input = document.getElementById('searchInput').value;
//     const location = document.querySelector(`[data-location='${input}']`);

//     if (locations) {
//         locations.scrollIntoView({ behavior: 'smooth' });
//     } else {
//         alert('Location not found');
//     }
// }


/*$('#_dlr_select_product').select2({
    minimumInputLength: 3,
    dropdownCssClass: "_dlr_sms_type",
    ajax: {
        type : "POST",
        dataType : "JSON",
        url : dlr.home + '/wp-json/api/dlrGetProductsByKey',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-WP-Nonce', dlr.nonce);
        },
        data: function (term) {
            return {
                key: term
            };
        },
        processResults: function (data) {
            return {
                results: $.map(data, function (item) {
                    return {
                        text: item.title,
                        id: item.id
                    }
                })
            };
        }
    }
});*/

// function searchAPI(query) {
//     $.ajax({
//         url: 'https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml',
//         dataType: 'xml',
//         data: {
//             q: query
//         },
//         success: function(response) {
//             displayResults(response);
//         },
//         error: function(xhr, status, error) {
//             console.error(status, error);
//         }
//     });
// }

/*function searchWeather() {
    var searchTerm = document.getElementById("searchInput").value.toLowerCase();
    var locationContainers = document.querySelectorAll(".container");
    locationContainers.forEach(function(container) {
        var locationName = container.querySelector("h1").innerText.toLowerCase();
        if (locationName.includes(searchTerm)) {
            container.style.display = "block";
        } else {
            container.style.display = "none";
        }
    });
} */

//Ai nya gua masih bingung tpi gimana kalau nanti AInya itu bisa memberikan notifikasi kalau cuaca menjadi hujan? dan bisa di set kayak alarm misak kita mau pergi jam 12 siang kalau cuaca bagus dia notif bagus kalau cuaca hujan nanti juga dia ngasih notif